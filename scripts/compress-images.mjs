#!/usr/bin/env node
/**
 * 图片压缩脚本
 * 将大尺寸 PNG/JPG 图片转换为 WebP 格式并压缩
 *
 * 使用方法: node scripts/compress-images.mjs
 */

import sharp from 'sharp'
import { readdir, stat, mkdir } from 'fs/promises'
import { join, extname, basename, dirname } from 'path'

const PUBLIC_IMAGES_DIR = 'public/images'
const SIZE_THRESHOLD = 500 * 1024 // 500KB - 超过此大小的图片将被压缩
const QUALITY = 80

async function getAllImages(dir) {
    const files = []
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
        const fullPath = join(dir, entry.name)
        if (entry.isDirectory()) {
            files.push(...await getAllImages(fullPath))
        } else if (/\.(png|jpg|jpeg)$/i.test(entry.name)) {
            files.push(fullPath)
        }
    }

    return files
}

async function compressImage(inputPath) {
    const stats = await stat(inputPath)
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2)

    if (stats.size < SIZE_THRESHOLD) {
        console.log(`⏭️  跳过 ${inputPath} (${sizeMB}MB - 小于阈值)`)
        return null
    }

    const ext = extname(inputPath).toLowerCase()
    const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, '.webp')

    try {
        const image = sharp(inputPath)
        const metadata = await image.metadata()

        // 如果图片宽度超过 2000px，缩放到 2000px
        let pipeline = image
        if (metadata.width > 2000) {
            pipeline = pipeline.resize(2000, null, { withoutEnlargement: true })
        }

        await pipeline
            .webp({ quality: QUALITY })
            .toFile(outputPath)

        const newStats = await stat(outputPath)
        const newSizeMB = (newStats.size / (1024 * 1024)).toFixed(2)
        const reduction = ((1 - newStats.size / stats.size) * 100).toFixed(1)

        console.log(`✅ ${inputPath}`)
        console.log(`   ${sizeMB}MB → ${newSizeMB}MB (减少 ${reduction}%)`)
        console.log(`   输出: ${outputPath}`)

        return {
            input: inputPath,
            output: outputPath,
            originalSize: stats.size,
            newSize: newStats.size,
            reduction: parseFloat(reduction)
        }
    } catch (error) {
        console.error(`❌ 处理失败 ${inputPath}:`, error.message)
        return null
    }
}

async function main() {
    console.log('🖼️  开始压缩图片...\n')
    console.log(`📁 扫描目录: ${PUBLIC_IMAGES_DIR}`)
    console.log(`📏 大小阈值: ${SIZE_THRESHOLD / 1024}KB`)
    console.log(`🎨 WebP 质量: ${QUALITY}\n`)

    const images = await getAllImages(PUBLIC_IMAGES_DIR)
    console.log(`找到 ${images.length} 张图片\n`)

    const results = []
    for (const imagePath of images) {
        const result = await compressImage(imagePath)
        if (result) {
            results.push(result)
        }
    }

    console.log('\n📊 压缩统计:')
    console.log(`   处理图片: ${results.length}`)

    if (results.length > 0) {
        const totalOriginal = results.reduce((sum, r) => sum + r.originalSize, 0)
        const totalNew = results.reduce((sum, r) => sum + r.newSize, 0)
        const totalReduction = ((1 - totalNew / totalOriginal) * 100).toFixed(1)

        console.log(`   原始大小: ${(totalOriginal / (1024 * 1024)).toFixed(2)}MB`)
        console.log(`   压缩后: ${(totalNew / (1024 * 1024)).toFixed(2)}MB`)
        console.log(`   总减少: ${totalReduction}%`)
    }

    console.log('\n✨ 完成!')
    console.log('\n⚠️  注意: 原始文件已保留，WebP 文件已生成。')
    console.log('   请手动更新代码中的图片引用或删除原始文件。')
}

main().catch(console.error)
