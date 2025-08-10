import type { Context, Next } from 'hono'
import { db } from '@server/db/db-instance'
import { posts } from '@server/db/feed-schema'
import { and, eq, gte, desc } from 'drizzle-orm'
import { CustomLogger } from '@server/lib/custom-logger'

export const createPostRateLimit = async (c: Context, next: Next) => {
    const user = c.get('user')
    const userId = user?.id

    if (!userId) {
        return c.json({ error: 'User not authenticated' }, 401)
    }

    try {
        const maxRequests = 5
        const windowMs = 60 * 1000 // 1 นาที
        const oneMinuteAgo = new Date(Date.now() - windowMs)

        const recentPosts = await db
            .select({
                id: posts.id,
                createdAt: posts.createdAt,
            })
            .from(posts)
            .where(and(eq(posts.userId, userId), gte(posts.createdAt, oneMinuteAgo)))
            .orderBy(desc(posts.createdAt))

        if (recentPosts.length >= maxRequests) {
            const latestPost = recentPosts[0]!

            const latestPostTime = new Date(latestPost.createdAt).getTime()
            const waitUntil = latestPostTime + windowMs
            const waitTimeMs = waitUntil - Date.now()
            const waitTimeSeconds = Math.ceil(waitTimeMs / 1000)

            return c.json(
                {
                    error: 'Too many posts created',
                    message: `You can only create ${maxRequests} post per minute. Please wait ${waitTimeSeconds} seconds.`,
                    th: `คุณสร้างโพสต์ได้เพียง ${maxRequests} โพสต์ต่อนาที กรุณารออีก ${waitTimeSeconds} วินาที`,
                    en: `You can only create ${maxRequests} post per minute. Please wait ${waitTimeSeconds} seconds.`,
                },
                429,
            )
        }

        await next()
    } catch (error) {
        CustomLogger.error('Rate limit error:', error)
        await next()
    }
}
