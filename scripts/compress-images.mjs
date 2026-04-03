import { promises as fs } from 'node:fs'
import { extname, resolve, dirname, relative } from 'node:path'
import process from 'node:process'

const projectRoot = process.cwd()
const imagesRoot = resolve(projectRoot, 'blob-assets/images')
const sourceExts = new Set(['.png', '.jpg', '.jpeg', '.gif'])

async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const files = []

    for (const entry of entries) {
        if (entry.name === '.DS_Store') continue

        const fullPath = resolve(dir, entry.name)
        if (entry.isDirectory()) {
            files.push(...await walk(fullPath))
            continue
        }

        files.push(fullPath)
    }

    return files
}

function getWebpOptions(inputPath) {
    const ext = extname(inputPath).toLowerCase()

    if (ext === '.png') {
        return {
            quality: 84,
            effort: 6,
            alphaQuality: 90,
            smartSubsample: true,
        }
    }

    if (ext === '.gif') {
        return {
            quality: 80,
            effort: 6,
            alphaQuality: 85,
            smartSubsample: true,
        }
    }

    return {
        quality: 80,
        effort: 6,
        smartSubsample: true,
    }
}

async function ensureDir(path) {
    await fs.mkdir(path, { recursive: true })
}

async function statSize(path) {
    const stat = await fs.stat(path)
    return stat.size
}

async function main() {
    let sharpModule
    try {
        sharpModule = (await import('sharp')).default
    }
    catch {
        console.error('sharp is required for `pnpm images:compress-webp`.')
        console.error('Install it locally with: pnpm add -D sharp')
        process.exit(1)
    }

    const allFiles = await walk(imagesRoot)
    const sourceFiles = allFiles.filter((filePath) => sourceExts.has(extname(filePath).toLowerCase()))

    let totalSourceBytes = 0
    let totalWebpBytes = 0
    let converted = 0
    const failed = []

    for (const sourcePath of sourceFiles) {
        const outputPath = sourcePath.replace(/\.[^.]+$/, '.webp')
        await ensureDir(dirname(outputPath))

        const ext = extname(sourcePath).toLowerCase()
        try {
            // GIFs are converted from first frame for stable, repeatable output size.
            const transformer = ext === '.gif'
                ? sharpModule(sourcePath, { pages: 1, limitInputPixels: false })
                : sharpModule(sourcePath, { limitInputPixels: false })

            await transformer
                .webp(getWebpOptions(sourcePath))
                .toFile(outputPath)

            totalSourceBytes += await statSize(sourcePath)
            totalWebpBytes += await statSize(outputPath)
            converted += 1

            const relSource = relative(projectRoot, sourcePath)
            const relOutput = relative(projectRoot, outputPath)
            console.log(`webp: ${relSource} -> ${relOutput}`)
        }
        catch (error) {
            failed.push({ sourcePath, error })
            console.error(`failed: ${relative(projectRoot, sourcePath)} -> ${String(error)}`)
        }
    }

    const savedBytes = totalSourceBytes - totalWebpBytes
    const savedPercent = totalSourceBytes > 0
        ? ((savedBytes / totalSourceBytes) * 100).toFixed(2)
        : '0.00'

    console.log('')
    console.log(`converted files: ${converted}`)
    console.log(`source total: ${totalSourceBytes} bytes`)
    console.log(`webp total: ${totalWebpBytes} bytes`)
    console.log(`saved: ${savedBytes} bytes (${savedPercent}%)`)

    if (failed.length > 0) {
        console.log(`failed files: ${failed.length}`)
        process.exitCode = 1
    }
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})
