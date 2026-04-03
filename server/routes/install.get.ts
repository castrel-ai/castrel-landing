import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { createError, setHeader } from 'h3'

const INSTALL_SCRIPT_PATH = resolve(process.cwd(), 'public/castrel-proxy/install.sh')

export default defineEventHandler((event) => {
    if (!existsSync(INSTALL_SCRIPT_PATH)) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Install script not found',
        })
    }

    setHeader(event, 'content-type', 'text/x-shellscript; charset=utf-8')
    setHeader(event, 'cache-control', 'public, max-age=300')

    return readFileSync(INSTALL_SCRIPT_PATH, 'utf8')
})
