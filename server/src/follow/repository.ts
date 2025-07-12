import { db } from '@server/db/db-instance'
import { followers } from '@server/db/feed-schema'
import { eq, and, count } from 'drizzle-orm'

export const followUserRepository = async (
    followerId: string,
    followingId: string
) => {
    const result = await db
        .insert(followers)
        .values({
            followerId,
            followingId,
        })
        .returning()

    return result[0]
}

export const unfollowUserRepository = async (
    followerId: string,
    followingId: string
) => {
    const result = await db
        .delete(followers)
        .where(
            and(
                eq(followers.followerId, followerId),
                eq(followers.followingId, followingId)
            )
        )
        .returning()

    return result[0]
}

export const isFollowingRepository = async (
    followerId: string,
    followingId: string
) => {
    const result = await db.query.followers.findFirst({
        where: and(
            eq(followers.followerId, followerId),
            eq(followers.followingId, followingId)
        ),
    })

    return !!result
}

export const getFollowersRepository = async (
    userId: string,
    offset: number = 0,
    limit: number = 20
) => {
    const result = await db.query.followers.findMany({
        where: eq(followers.followingId, userId),
        with: {
            follower: {
                columns: {
                    id: true,
                    username: true,
                    displayName: true,
                    image: true,
                },
            },
        },
        offset,
        limit,
        orderBy: (followers, { desc }) => [desc(followers.createdAt)],
    })

    const totalQuery = await db
        .select({ count: count() })
        .from(followers)
        .where(eq(followers.followingId, userId))

    const total = totalQuery[0]?.count || 0
    const hasMore = offset + limit < total

    return {
        followers: result.map((f) => f.follower),
        total,
        hasMore,
    }
}

export const getFollowingRepository = async (
    userId: string,
    offset: number = 0,
    limit: number = 20
) => {
    const result = await db.query.followers.findMany({
        where: eq(followers.followerId, userId),
        with: {
            following: {
                columns: {
                    id: true,
                    username: true,
                    displayName: true,
                    image: true,
                },
            },
        },
        offset,
        limit,
        orderBy: (followers, { desc }) => [desc(followers.createdAt)],
    })

    const totalQuery = await db
        .select({ count: count() })
        .from(followers)
        .where(eq(followers.followerId, userId))

    const total = totalQuery[0]?.count || 0
    const hasMore = offset + limit < total

    return {
        following: result.map((f) => f.following),
        total,
        hasMore,
    }
}

export const getFollowStatsRepository = async (userId: string) => {
    const [followersCount, followingCount] = await Promise.all([
        db
            .select({ count: count() })
            .from(followers)
            .where(eq(followers.followingId, userId)),
        db
            .select({ count: count() })
            .from(followers)
            .where(eq(followers.followerId, userId)),
    ])

    return {
        followersCount: followersCount[0]?.count || 0,
        followingCount: followingCount[0]?.count || 0,
    }
}
