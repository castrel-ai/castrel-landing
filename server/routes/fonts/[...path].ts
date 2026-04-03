import { getRouterParam } from 'h3'
import { serveBlobBackedAsset } from '../../utils/blob-assets'

export default defineEventHandler(async (event) => {
    const path = getRouterParam(event, 'path')
    return serveBlobBackedAsset(event, 'fonts', path)
})
