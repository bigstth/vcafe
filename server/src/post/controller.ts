import { errorResponseFormat } from '@server/lib/error'
import { getAllPostsService } from './service'
import type { Context } from 'hono'

export const getAllPostsController = async (c: Context) => {
    try {
        const limit = parseInt(c.req.query('limit') || '10')
        const offset = parseInt(c.req.query('offset') || '0')
        const orderBy = (c.req.query('orderBy') as 'asc' | 'desc') || 'desc'

        const posts = await getAllPostsService({
            limit,
            offset,
            orderBy,
        })

        return c.json(posts)
    } catch (e: unknown) {
        return errorResponseFormat(c, e)
    }
}
