import { AppError } from '@server/lib/error'
import { getMeRepository } from './repository'
import { userNotFoundError } from './errors'
import { auth } from '@server/lib/auth'
import type { Context } from 'hono'

export const getMeService = async (c: Context) => {
    const user = c.get('user')
    const userInfo = await getMeRepository(user.id)

    if (!userInfo) {
        throw new AppError(userNotFoundError)
    }

    const accounts = await auth.api.listUserAccounts({
        headers: new Headers(c.req.header()),
    })

    const linkedProviders = accounts.map((account) => ({
        provider: account.provider,
        providerAccountId: account.id,
    }))

    return { ...userInfo, linkedProviders }
}
