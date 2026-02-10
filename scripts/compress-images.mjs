#!/usr/bin/env node
/**
 * 图片压缩脚本
 *
 * 支持模式：
 * 1) 默认模式：扫描 public/images，原地压缩
 * 2) 定向模式：--dir=public/images/blog/openclaw-monitoring
 * 3) 变更模式：--git-changed（仅处理 git 已新增/修改的图片）
 *
 * 常用示例：
 * - node scripts/compress-images.mjs
 * - node scripts/compress-images.mjs --dir=public/images/blog/openclaw-monitoring --max-width=1920 --min-size-kb=800
 * - node scripts/compress-images.mjs --git-changed
 */

import sharp from 'sharp'
import { execSync } from 'node:child_process'
import { readdir, stat, writeFile } from 'node:fs/promises'
import { extname, join, resolve } from 'node:path'

const DEFAULT_IMAGE_ROOT = 'public/images'
const SUPPORTED_IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp'])

function parseBooleanFlag(argumentList, flagName) {
    return argumentList.includes(flagName)
}

function parseStringOption(argumentList, optionName) {
    const targetPrefix = `${optionName}=`
    const matchedArgument = argumentList.find(argument => argument.startsWith(targetPrefix))
    if (!matchedArgument) {
        return null
    }
    return matchedArgument.slice(targetPrefix.length)
}

function parseNumberOption(argumentList, optionName, fallbackValue) {
    const rawOptionValue = parseStringOption(argumentList, optionName)
    if (!rawOptionValue) {
        return fallbackValue
    }
    const parsedValue = Number(rawOptionValue)
    if (!Number.isFinite(parsedValue) || parsedValue < 0) {
        throw new Error(`${optionName} 必须是非负数字，当前值: ${rawOptionValue}`)
    }
    return parsedValue
}

function isSupportedImagePath(filePath) {
    const extension = extname(filePath).toLowerCase()
    return SUPPORTED_IMAGE_EXTENSIONS.has(extension)
}

async function collectImagesRecursively(targetDirectoryPath) {
    const collectedImagePaths = []
    const directoryEntries = await readdir(targetDirectoryPath, { withFileTypes: true })

    for (const directoryEntry of directoryEntries) {
        const absoluteEntryPath = join(targetDirectoryPath, directoryEntry.name)
        if (directoryEntry.isDirectory()) {
            const nestedImages = await collectImagesRecursively(absoluteEntryPath)
            collectedImagePaths.push(...nestedImages)
            continue
        }

        if (directoryEntry.isFile() && isSupportedImagePath(absoluteEntryPath)) {
            collectedImagePaths.push(absoluteEntryPath)
        }
    }

    return collectedImagePaths
}

function collectChangedImagesFromGit() {
    const gitStatusOutput = execSync('git status --porcelain', { encoding: 'utf8' })
    const changedImagePaths = []

    for (const outputLine of gitStatusOutput.split('\n')) {
        const trimmedLine = outputLine.trim()
        if (!trimmedLine) {
            continue
        }
        const rawPath = trimmedLine.slice(3).trim()
        if (!rawPath) {
            continue
        }
        if (!isSupportedImagePath(rawPath)) {
            continue
        }
        changedImagePaths.push(resolve(rawPath))
    }

    return Array.from(new Set(changedImagePaths))
}

function createSharpPipeline(sourceFilePath, sourceExtension, options) {
    let imagePipeline = sharp(sourceFilePath)

    if (options.maxWidth > 0) {
        imagePipeline = imagePipeline.resize({
            width: options.maxWidth,
            withoutEnlargement: true,
        })
    }

    if (sourceExtension === '.png') {
        return imagePipeline.png({
            compressionLevel: 9,
            adaptiveFiltering: true,
            effort: 10,
            palette: true,
            quality: options.quality,
        })
    }

    if (sourceExtension === '.jpg' || sourceExtension === '.jpeg') {
        return imagePipeline.jpeg({
            quality: options.quality,
            mozjpeg: true,
            progressive: true,
            chromaSubsampling: '4:2:0',
        })
    }

    return imagePipeline.webp({ quality: options.quality, effort: 6 })
}

async function compressSingleImage(sourceFilePath, options) {
    const sourceFileStats = await stat(sourceFilePath)
    if (sourceFileStats.size < options.minSizeBytes) {
        const sourceSizeMb = (sourceFileStats.size / 1024 / 1024).toFixed(2)
        console.log(`⏭️  跳过 ${sourceFilePath} (${sourceSizeMb}MB - 小于阈值)`)
        return null
    }

    const sourceExtension = extname(sourceFilePath).toLowerCase()
    const outputFilePath = sourceFilePath
    const sourceSizeMb = (sourceFileStats.size / 1024 / 1024).toFixed(2)

    try {
        const imageMetadata = await sharp(sourceFilePath).metadata()
        const optimizedImageBuffer = await createSharpPipeline(sourceFilePath, sourceExtension, options).toBuffer()
        await writeFile(outputFilePath, optimizedImageBuffer)

        const outputFileStats = await stat(outputFilePath)
        const outputSizeMb = (outputFileStats.size / 1024 / 1024).toFixed(2)
        const reductionRatio = (1 - outputFileStats.size / sourceFileStats.size) * 100
        const safeReductionRatio = Number.isFinite(reductionRatio) ? reductionRatio : 0
        const optimizedMetadata = await sharp(outputFilePath).metadata()

        console.log(`✅ ${sourceFilePath}`)
        console.log(`   ${sourceSizeMb}MB → ${outputSizeMb}MB (减少 ${safeReductionRatio.toFixed(1)}%)`)
        console.log(`   尺寸: ${imageMetadata.width}x${imageMetadata.height} → ${optimizedMetadata.width}x${optimizedMetadata.height}`)

        return {
            sourcePath: sourceFilePath,
            outputPath: outputFilePath,
            sourceBytes: sourceFileStats.size,
            outputBytes: outputFileStats.size,
            reductionRatio: safeReductionRatio,
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        console.error(`❌ 处理失败 ${sourceFilePath}: ${errorMessage}`)
        return null
    }
}

async function resolveTargetImages(options) {
    if (options.gitChangedOnly) {
        return collectChangedImagesFromGit()
    }
    return collectImagesRecursively(options.targetDirectoryPath)
}

function parseRuntimeOptions() {
    const argumentList = process.argv.slice(2)

    const runtimeOptions = {
        gitChangedOnly: parseBooleanFlag(argumentList, '--git-changed'),
        targetDirectoryPath: resolve(parseStringOption(argumentList, '--dir') || DEFAULT_IMAGE_ROOT),
        quality: parseNumberOption(argumentList, '--quality', 80),
        maxWidth: parseNumberOption(argumentList, '--max-width', 2000),
        minSizeKb: parseNumberOption(argumentList, '--min-size-kb', 800),
    }

    if (runtimeOptions.quality > 100) {
        throw new Error('--quality 不能大于 100')
    }

    return {
        ...runtimeOptions,
        minSizeBytes: runtimeOptions.minSizeKb * 1024,
    }
}

async function main() {
    const runtimeOptions = parseRuntimeOptions()

    console.log('🖼️  开始压缩图片...\n')
    console.log(`📁 目标目录: ${runtimeOptions.targetDirectoryPath}`)
    console.log(`🔁 处理模式: ${runtimeOptions.gitChangedOnly ? '仅 git 变更图片' : '目录扫描'}`)
    console.log('✍️  写入方式: 原地覆盖')
    console.log(`📏 大小阈值: ${runtimeOptions.minSizeKb}KB`)
    console.log(`🎨 图片质量: ${runtimeOptions.quality}`)
    console.log(`↔️  最大宽度: ${runtimeOptions.maxWidth}px\n`)

    const imagePaths = await resolveTargetImages(runtimeOptions)
    const uniqueImagePaths = Array.from(new Set(imagePaths)).sort()
    console.log(`找到 ${uniqueImagePaths.length} 张待处理图片\n`)

    const compressedResults = []
    for (const imagePath of uniqueImagePaths) {
        const compressionResult = await compressSingleImage(imagePath, runtimeOptions)
        if (compressionResult) {
            compressedResults.push(compressionResult)
        }
    }

    console.log('\n📊 压缩统计:')
    console.log(`   成功处理: ${compressedResults.length}`)
    console.log(`   总候选数: ${uniqueImagePaths.length}`)

    if (compressedResults.length > 0) {
        const totalSourceBytes = compressedResults.reduce(
            (sum, currentItem) => sum + currentItem.sourceBytes,
            0
        )
        const totalOutputBytes = compressedResults.reduce(
            (sum, currentItem) => sum + currentItem.outputBytes,
            0
        )
        const totalReductionRatio = (1 - totalOutputBytes / totalSourceBytes) * 100

        console.log(`   原始大小: ${(totalSourceBytes / (1024 * 1024)).toFixed(2)}MB`)
        console.log(`   压缩后: ${(totalOutputBytes / (1024 * 1024)).toFixed(2)}MB`)
        console.log(`   总减少: ${totalReductionRatio.toFixed(1)}%`)
    }

    console.log('\n✨ 完成!')
}

main().catch(error => {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`\n❌ 脚本执行失败: ${errorMessage}`)
    process.exitCode = 1
})
