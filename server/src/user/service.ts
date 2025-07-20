import {
    getMeRepository,
    getUserByUsernameRepository,
    getUserPostsRepository,
    getUserRepository,
    updateUserRepository,
} from './repository'
import { userNotFoundError } from './errors'
import { auth } from '@server/lib/auth'
import type { Context } from 'hono'
import { AppError } from '@server/lib/error'
import { noPostFoundError } from '@server/post/errors'
import { mapImageUrls } from '@server/lib/map-image-urls'
import { CustomLogger } from '@server/lib/custom-logger'

export const getMeService = async (c: Context) => {
    const user = c.get('user')
    const userInfo = await getMeRepository(user.id)

    if (!userInfo) {
        throw new AppError(userNotFoundError)
    }

    const accounts = await auth.api.listUserAccounts({
        headers: new Headers(c.req.header()),
    })

    const linkedProviders = accounts.map((account: any) => ({
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

export const registerService = async (c: Context) => {
    const formData = c.get('validatedFormData')

    const user = c.get('user')

    if (!user) {
        throw new AppError(userNotFoundError)
    }

    await checkDuplicateUsername(formData.username, user.id)

    try {
        await auth.api.setPassword({
            body: { newPassword: formData.password },
            headers: new Headers(c.req.header()),
        })
    } catch (error) {
        CustomLogger.error(`Error setting password for user ${user.id}`, error)
        throw new AppError({
            statusName: 'validation_error',
            en: 'Failed to set password',
            th: 'ไม่สามารถตั้งรหัสผ่านได้',
            status: 400,
        })
    }

    const result = await updateUserRepository(user.id, {
        username: formData.username,
        displayUsername: formData.displayUsername,
    })

    if (!result) {
        throw new AppError({
            statusName: 'internal_error',
            en: 'Failed to update user information',
            th: 'ไม่สามารถอัปเดตข้อมูลผู้ใช้ได้',
            status: 500,
        })
    }

    return result
}

const checkDuplicateUsername = async (username: string, userId: string) => {
    const existingUser = await getUserByUsernameRepository(username)
    if (existingUser?.id && existingUser.id !== userId) {
        throw new AppError({
            statusName: 'validation_error',
            en: 'Username already exists',
            th: 'ชื่อผู้ใช้มีอยู่แล้ว',
            status: 400,
        })
    }
}
