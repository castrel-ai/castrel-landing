import manifestJson from '~~/blob-assets-manifest.json'

interface BlobAssetsManifest {
    assets?: Record<string, string>
}

const manifestAssets = (manifestJson as BlobAssetsManifest).assets ?? {}

function splitUrlSuffix(src: string) {
    const suffixStart = src.search(/[?#]/)
    if (suffixStart === -1) {
        return { path: src, suffix: '' }
    }

    return {
        path: src.slice(0, suffixStart),
        suffix: src.slice(suffixStart),
    }
}

export function resolveBlobAssetUrl(src: string | null | undefined): string {
    if (!src) return ''

    if (
        src.startsWith('http://')
        || src.startsWith('https://')
        || src.startsWith('//')
        || src.startsWith('data:')
        || src.startsWith('blob:')
        || src.startsWith('#')
    ) {
        return src
    }

    const { path, suffix } = splitUrlSuffix(src)
    const blobUrl = manifestAssets[path]

    return blobUrl ? `${blobUrl}${suffix}` : src
}
