import {
    getMeRepository,
    getUserPostsRepository,
    getUserRepository,
} from './repository'
import { userNotFoundError } from './errors'
import { auth } from '@server/lib/auth'
import type { Context } from 'hono'
import { AppError } from '@server/lib/error'
import { noPostFoundError } from '@server/post/errors'
import { mapImageUrls } from '@server/lib/map-image-urls'

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

export const getUserService = async (id: string) => {
    const user = await getUserRepository(id)

    if (!user) {
        throw new AppError(userNotFoundError)
    }

    return user
}

export const getUserPostsService = async (c: Context) => {
    const userId = c.get('validatedParam').id
    const {
        offset,
        limit,
        orderBy,
        includeArchived = false,
    } = c.get('validatedQuery')

    const posts = await getUserPostsRepository({
        userId,
        offset,
        limit,
        orderBy,
        includeArchived,
        currentUserId: c.get('user').id,
    })

    if (!posts) {
        throw new AppError(noPostFoundError)
    }
    const postsWithImageUrls = posts.posts.map((post) => ({
        ...post,
        images: mapImageUrls(post.images),
    }))

    return {
        ...posts,
        posts: postsWithImageUrls,
    }
}
