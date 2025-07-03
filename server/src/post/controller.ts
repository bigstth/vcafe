import { errorResponseFormat } from '@server/lib/error'
import { createPostService, getAllPostsService } from './service'
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

export const createPostController = async (c: Context) => {
    try {
        const data = await c.req.json<{ content: string; visibility?: 'public' | 'follower_only' | 'membership_only' }>()
        const user = c.get('user')
        if (!user.id || !data.content) {
            return c.json({ error: 'User ID and content are required' }, 400)
        }

        const newPost = await createPostService({ userId: user.id, ...data })

        return c.json(newPost, 201)
    } catch (e: unknown) {
        console.log(e)
        return errorResponseFormat(c, e)
    }
}
