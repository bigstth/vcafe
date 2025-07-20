import { postImages, posts, comments, user } from '@server/db'
import { db } from '@server/db/db-instance'
import { activePostsCondition } from '@server/lib/soft-delete'
import { and, asc, desc, count, eq } from 'drizzle-orm'

export interface GetUserPostsOptions {
    userId: string
    limit: number
    offset: number
    orderBy?: 'asc' | 'desc'
    includeArchived?: boolean
    currentUserId?: string // For checking if viewer is the owner
}

export const getMeRepository = async (id: string) => {
    return db.query.user.findFirst({ where: (u, { eq }) => eq(u.id, id) })
}

export const getUserRepository = async (id: string) => {
    return db.query.user.findFirst({ where: (u, { eq }) => eq(u.id, id) })
}

export const getUserByUsernameRepository = async (username: string) => {
    return db.query.user.findFirst({
        where: (u, { eq }) => eq(u.username, username),
    })
}

export const getUserPostsRepository = async (options: GetUserPostsOptions) => {
    const {
        userId,
        offset = 0,
        limit = 10,
        orderBy = 'desc',
        includeArchived = false,
        currentUserId,
    } = options

    const isOwner = currentUserId === userId

    let whereConditions = [eq(posts.userId, userId)]

    if (isOwner) {
        whereConditions.push(
            includeArchived
                ? eq(posts.isDeleted, false) // Show deleted=false, archived can be true/false
                : activePostsCondition()
        )
    } else {
        whereConditions.push(
            activePostsCondition(),
            eq(posts.visibility, 'public')
        )
    }

    const result = await db.query.posts.findMany({
        where: and(...whereConditions),
        with: {
            author: {
                columns: {
                    id: true,
                    name: true,
                    username: true,
                    image: true,
                },
            },
            images: {
                orderBy: [asc(postImages.displayOrder)],
            },
            comments: {
                where: eq(comments.isDeleted, false),
                with: {
                    author: {
                        columns: {
                            id: true,
                            name: true,
                            username: true,
                            image: true,
                        },
                    },
                },
                orderBy: [desc(comments.createdAt)],
            },
            likes: true,
        },
        orderBy:
            orderBy === 'desc'
                ? [desc(posts.createdAt)]
                : [asc(posts.createdAt)],
        offset,
        limit,
    })

    const totalQuery = await db
        .select({ count: count() })
        .from(posts)
        .where(and(...whereConditions))

    const total = totalQuery[0]?.count || 0
    const hasMore = offset + limit < total

    return {
        posts: result,
        total,
        hasMore,
        isOwner,
    }
}

export const updateUserRepository = async (id: string, data: Partial<any>) => {
    const result = await db
        .update(user)
        .set(data)
        .where(eq(user.id, id))
        .returning()

    if (result.length === 0) {
        throw new Error('User not found or no changes made')
    }

    return result[0]
}
