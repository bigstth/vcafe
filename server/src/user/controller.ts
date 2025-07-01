import type { Context } from 'hono'
import { getMeService } from './service'
import { errorResponseFormat } from '@server/lib/error'

export const getMeController = async (c: Context) => {
    const user = c.get('user')

    try {
        const userInfo = await getMeService(user?.id)
        return c.json(userInfo)
    } catch (e: unknown) {
        return errorResponseFormat(c, e)
    }
}
