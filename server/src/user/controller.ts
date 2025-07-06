import type { Context } from 'hono'
import { getMeService } from './service'
import { errorResponseFormat } from '@server/lib/error'

export const getMeController = async (c: Context) => {
    try {
        const userInfo = await getMeService(c)
        return c.json(userInfo)
    } catch (e: unknown) {
        return errorResponseFormat(c, e)
    }
}
