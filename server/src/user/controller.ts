import type { Context } from 'hono'
import {
    getMeService,
    getUserPostsService,
    getUserService,
    registerService,
} from './service'
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

export const getUserController = async (c: Context) => {
    const { id } = c.get('validatedParam')
    try {
        const user = await getUserService(id)
        return c.json(user)
    } catch (e: unknown) {
        CustomLogger.error(`Error in getUserController for user ${id}`, e)
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

export const registerController = async (c: Context) => {
    try {
        const result = await registerService(c)

        return c.json(result)
    } catch (e: unknown) {
        CustomLogger.error(`Error in registerController`, e)
        return errorResponseFormat(c, e)
    }
}
