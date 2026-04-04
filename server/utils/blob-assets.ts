import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs'
import { Readable } from 'node:stream'
import { extname, resolve } from 'node:path'
import { createError, sendStream, setHeader, type H3Event } from 'h3'
import manifestJson from '../../blob-assets-manifest.json'

interface BlobAssetsManifest {
    assets?: Record<string, string>
}

interface AssetPathInfo {
    publicPath: string
    localPath: string
}

type AssetBaseDir = 'images' | 'fonts' | 'castrel-proxy/packages'
interface BlobAssetServeOptions {
    fallbackToLocal?: boolean
}

let manifestCache: Record<string, string> | null = null
let manifestMtimeMs = -1

const LOCAL_ASSET_ROOT = resolve(process.cwd(), 'blob-assets')
const MANIFEST_PATH = resolve(process.cwd(), 'blob-assets-manifest.json')
const STATIC_MANIFEST_ASSETS = (manifestJson as BlobAssetsManifest).assets ?? {}

function normalizePathSegment(input: string | string[] | undefined) {
    if (!input) return ''

    const raw = Array.isArray(input) ? input.join('/') : input
    const normalized = raw
        .split('/')
        .filter(Boolean)
        .map((segment) => decodeURIComponent(segment))
        .join('/')

    if (normalized.includes('..')) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid asset path',
        })
    }

    return normalized
}

function buildAssetPath(baseDir: AssetBaseDir, path: string | string[] | undefined): AssetPathInfo {
    const normalized = normalizePathSegment(path)
    if (!normalized) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Asset not found',
        })
    }

    const publicPath = `/${baseDir}/${normalized}`
    const localPath = resolve(LOCAL_ASSET_ROOT, `${baseDir}/${normalized}`)

    if (!localPath.startsWith(LOCAL_ASSET_ROOT)) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Invalid asset path',
        })
    }

    return { publicPath, localPath }
}

function getContentType(filePath: string) {
    const ext = extname(filePath).toLowerCase()
    if (ext === '.png') return 'image/png'
    if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg'
    if (ext === '.gif') return 'image/gif'
    if (ext === '.webp') return 'image/webp'
    if (ext === '.svg') return 'image/svg+xml'
    if (ext === '.ico') return 'image/x-icon'
    if (ext === '.woff2') return 'font/woff2'
    if (ext === '.woff') return 'font/woff'
    if (ext === '.ttf') return 'font/ttf'
    if (ext === '.sha256') return 'text/plain; charset=utf-8'
    return 'application/octet-stream'
}

function loadManifest() {
    // In serverless runtimes, relying on process.cwd() file reads is brittle.
    // Use the statically bundled manifest in production.
    if (process.env.NODE_ENV === 'production') {
        return STATIC_MANIFEST_ASSETS
    }

    try {
        const stat = statSync(MANIFEST_PATH)
        if (manifestCache && manifestMtimeMs === stat.mtimeMs) {
            return manifestCache
        }

        const raw = readFileSync(MANIFEST_PATH, 'utf8')
        const parsed = JSON.parse(raw) as BlobAssetsManifest
        manifestCache = parsed.assets ?? {}
        manifestMtimeMs = stat.mtimeMs
        return manifestCache
    }
    catch {
        manifestCache = STATIC_MANIFEST_ASSETS
        manifestMtimeMs = -1
        return manifestCache
    }
}

function getBlobUrl(publicPath: string) {
    const manifest = loadManifest()
    if (manifest[publicPath]) return manifest[publicPath]

    const baseUrl = process.env.BLOB_ASSET_BASE_URL || process.env.NUXT_PUBLIC_BLOB_ASSET_BASE_URL
    if (!baseUrl) return ''

    return `${baseUrl.replace(/\/$/, '')}${publicPath}`
}

async function streamBlobAsset(event: H3Event, url: string) {
    const response = await fetch(url)
    if (!response.ok || !response.body) {
        throw createError({
            statusCode: 404,
            statusMessage: `Blob asset not found: ${url}`,
        })
    }

    setHeader(event, 'cache-control', response.headers.get('cache-control') || 'public, max-age=31536000, immutable')

    const contentType = response.headers.get('content-type')
    if (contentType) {
        setHeader(event, 'content-type', contentType)
    }

    return sendStream(event, Readable.fromWeb(response.body as unknown as globalThis.ReadableStream))
}

function streamLocalAsset(event: H3Event, localPath: string) {
    if (!existsSync(localPath)) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Asset not found',
        })
    }

    setHeader(event, 'cache-control', 'public, max-age=31536000, immutable')
    setHeader(event, 'content-type', getContentType(localPath))

    return sendStream(event, createReadStream(localPath))
}

export async function serveBlobBackedAsset(
    event: H3Event,
    baseDir: AssetBaseDir,
    path: string | string[] | undefined,
    options: BlobAssetServeOptions = {},
) {
    const { publicPath, localPath } = buildAssetPath(baseDir, path)
    const blobUrl = getBlobUrl(publicPath)
    const fallbackToLocal = options.fallbackToLocal ?? true

    if (blobUrl) {
        try {
            return await streamBlobAsset(event, blobUrl)
        }
        catch {
            if (fallbackToLocal) {
                return streamLocalAsset(event, localPath)
            }
        }
    }

    if (fallbackToLocal) {
        return streamLocalAsset(event, localPath)
    }

    throw createError({
        statusCode: 404,
        statusMessage: 'Asset not found',
    })
}
