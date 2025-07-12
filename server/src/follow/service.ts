import { AppError } from '@server/lib/error'
import { CustomLogger } from '@server/lib/custom-logger'
import {
    invalidFollowError,
    alreadyFollowingError,
    notFollowingError,
    followFailedError,
    unfollowFailedError,
    getFollowersFailedError,
    getFollowingFailedError,
    getFollowStatusFailedError,
    getFollowStatsFailedError,
} from './errors'
import {
    followUserRepository,
    unfollowUserRepository,
    isFollowingRepository,
    getFollowersRepository,
    getFollowingRepository,
    getFollowStatsRepository,
} from './repository'

export const followUserService = async (
    followerId: string,
    followingId: string
) => {
    if (followerId === followingId) {
        throw new AppError(invalidFollowError)
    }

    const isAlreadyFollowing = await isFollowingRepository(
        followerId,
        followingId
    )

    if (isAlreadyFollowing) {
        throw new AppError(alreadyFollowingError)
    }

    try {
        const result = await followUserRepository(followerId, followingId)
        CustomLogger.info(`User ${followerId} followed ${followingId}`)
        return result
    } catch (error) {
        CustomLogger.error('Error following user', {
            followerId,
            followingId,
            error,
        })

        throw new AppError(followFailedError)
    }
}

export const unfollowUserService = async (
    followerId: string,
    followingId: string
) => {
    const isCurrentlyFollowing = await isFollowingRepository(
        followerId,
        followingId
    )
    if (!isCurrentlyFollowing) {
        throw new AppError(notFollowingError)
    }

    try {
        const result = await unfollowUserRepository(followerId, followingId)
        CustomLogger.info(`User ${followerId} unfollowed ${followingId}`)
        return result
    } catch (error) {
        CustomLogger.error('Error unfollowing user', {
            followerId,
            followingId,
            error,
        })
        throw new AppError(unfollowFailedError)
    }
}

export const getFollowersService = async (
    userId: string,
    offset: number = 0,
    limit: number = 20
) => {
    try {
        return await getFollowersRepository(userId, offset, limit)
    } catch (error) {
        CustomLogger.error('Error getting followers', { userId, error })
        throw new AppError(getFollowersFailedError)
    }
}

export const getFollowingService = async (
    userId: string,
    offset: number = 0,
    limit: number = 20
) => {
    try {
        return await getFollowingRepository(userId, offset, limit)
    } catch (error) {
        CustomLogger.error('Error getting following', { userId, error })
        throw new AppError(getFollowingFailedError)
    }
}

export const getFollowStatusService = async (
    followerId: string,
    followingId: string
) => {
    try {
        const isFollowing = await isFollowingRepository(followerId, followingId)
        return { isFollowing }
    } catch (error) {
        CustomLogger.error('Error getting follow status', {
            followerId,
            followingId,
            error,
        })
        throw new AppError(getFollowStatusFailedError)
    }
}

export const getFollowStatsService = async (userId: string) => {
    try {
        return await getFollowStatsRepository(userId)
    } catch (error) {
        CustomLogger.error('Error getting follow stats', { userId, error })
        throw new AppError(getFollowStatsFailedError)
    }
}
