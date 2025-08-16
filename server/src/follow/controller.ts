import type { Context } from 'hono'
import { errorResponseFormat } from '@server/lib/error'
import {
    followUserService,
    unfollowUserService,
    getFollowersService,
    getFollowingService,
    getFollowStatusService,
    getFollowStatsService
} from './service'

export const followUserController = async (c: Context) => {
    try {
        const user = c.get('user')
        const { userId: followingId } = c.get('validatedParam')

        const result = await followUserService(user.id, followingId)

        return c.json(
            {
                success: true,
                message: 'Successfully followed user',
                data: result
            },
            201
        )
    } catch (e: unknown) {
        return errorResponseFormat(c, e)
    }
}

export const unfollowUserController = async (c: Context) => {
    try {
        const user = c.get('user')
        const { userId: followingId } = c.get('validatedParam')

        const result = await unfollowUserService(user.id, followingId)

        return c.json({
            success: true,
            message: 'Successfully unfollowed user',
            data: result
        })
    } catch (e: unknown) {
        return errorResponseFormat(c, e)
    }
}

export const getFollowersController = async (c: Context) => {
    try {
        const { userId } = c.get('validatedParam')
        const { offset = '0', limit = '20' } = c.get('validatedQuery')

        const result = await getFollowersService(
            userId,
            parseInt(offset),
            parseInt(limit)
        )

        return c.json(result)
    } catch (e: unknown) {
        return errorResponseFormat(c, e)
    }
}

export const getFollowingController = async (c: Context) => {
    try {
        const { userId } = c.get('validatedParam')
        const { offset = '0', limit = '20' } = c.get('validatedQuery')

        const result = await getFollowingService(
            userId,
            parseInt(offset),
            parseInt(limit)
        )

        return c.json(result)
    } catch (e: unknown) {
        return errorResponseFormat(c, e)
    }
}

export const getFollowStatusController = async (c: Context) => {
    try {
        const user = c.get('user')
        const { userId: followingId } = c.get('validatedParam')

        const result = await getFollowStatusService(user.id, followingId)

        return c.json(result)
    } catch (e: unknown) {
        return errorResponseFormat(c, e)
    }
}

export const getFollowStatsController = async (c: Context) => {
    try {
        const { userId } = c.get('validatedParam')

        const result = await getFollowStatsService(userId)

        return c.json(result)
    } catch (e: unknown) {
        return errorResponseFormat(c, e)
    }
}
