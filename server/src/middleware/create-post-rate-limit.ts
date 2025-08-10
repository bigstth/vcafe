import type { Context, Next } from 'hono'

interface UserRateLimit {
    count: number
    resetTime: number
}

const userLimits = new Map<string, UserRateLimit>()

export const createPostRateLimit = async (c: Context, next: Next) => {
    const user = c.get('user')
    const userId = user?.id

    const now = Date.now()
    const windowMs = 60 * 1000 // 1 นาที
    const maxRequests = 5

    const userLimit = userLimits.get(userId)

    if (!userLimit || now > userLimit.resetTime) {
        userLimits.set(userId, {
            count: 1,
            resetTime: now + windowMs,
        })
        await next()
        return
    }

    if (userLimit.count >= maxRequests) {
        const resetInSeconds = Math.ceil((userLimit.resetTime - now) / 1000)

        return c.json(
            {
                error: 'Too many posts created',
                message: `You can only create ${maxRequests} posts per minute. Try again in ${resetInSeconds} seconds.`,
                th: `คุณสร้างโพสต์ได้เพียง ${maxRequests} โพสต์ต่อนาที กรุณารออีก ${resetInSeconds} วินาที`,
                en: `You can only create ${maxRequests} posts per minute. Try again in ${resetInSeconds} seconds.`,
                resetTime: new Date(userLimit.resetTime),
            },
            429,
        )
    }

    userLimit.count++
    userLimits.set(userId, userLimit)

    await next()
}
