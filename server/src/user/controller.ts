import type { Context } from 'hono'
import { getMeService, getUserPostsService } from './service'
import { errorResponseFormat } from '@server/lib/error'
import { CustomLogger } from '@server/lib/custom-logger'

export const getMeController = async (c: Context) => {
    try {
        const userInfo = await getMeService(c)
        return c.json(userInfo)
    } catch (e: unknown) {
        return errorResponseFormat(c, e)
    }
}

export const getUserPostsController = async (c: Context) => {
    try {
        const posts = await getUserPostsService(c)

        return c.json(posts)
    } catch (e: unknown) {
        CustomLogger.error(`Error in getUserPostsController`, e)
        return errorResponseFormat(c, e)
    }
}
