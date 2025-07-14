import { db } from '@server/db/db-instance'
import { posts, postImages, comments } from '@server/db/feed-schema'
import { eq, desc, asc, and, count, sql } from 'drizzle-orm'
import { activePostsCondition } from '@server/lib/soft-delete'
import type { NewPost, Post } from '@server/types/schema'
import { CustomLogger } from '@server/lib/custom-logger'

export interface GetPostsOptions {
    limit: number
    offset: number
    orderBy?: 'asc' | 'desc'
}

export interface GetUserPostsOptions {
    userId: string
    limit: number
    offset: number
    orderBy?: 'asc' | 'desc'
    includeArchived?: boolean
    currentUserId?: string // For checking if viewer is the owner
}

export interface GetPostsResult {
    posts: Post[]
    hasMore: boolean
}

export interface CreatePostData {
    userId: string
    content: string
    visibility?: 'public' | 'follower_only' | 'membership_only'
}

export const getPostsWithImagesRepository = async (
    options: GetPostsOptions
) => {
    const { offset = 0, limit = 10, orderBy = 'desc' } = options

    const whereConditions = [
        activePostsCondition(),
        eq(posts.visibility, 'public'),
    ]

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
    }
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

// Get user's archived posts (owner only)
export const getUserArchivedPostsRepository = async (
    userId: string,
    currentUserId: string,
    offset: number = 0,
    limit: number = 10
) => {
    if (userId !== currentUserId) {
        return {
            posts: [],
            total: 0,
            hasMore: false,
        }
    }

    const whereConditions = [
        eq(posts.userId, userId),
        eq(posts.isDeleted, false),
        eq(posts.isArchived, true),
    ]

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
        },
        orderBy: [desc(posts.archivedAt)],
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
        posts: result || [],
        total,
        hasMore,
    }
}

// Get user's deleted posts (owner only)
export const getUserDeletedPostsRepository = async (
    userId: string,
    currentUserId: string,
    offset: number = 0,
    limit: number = 10
) => {
    // Only owner can see deleted posts
    if (userId !== currentUserId) {
        return {
            posts: [],
            total: 0,
            hasMore: false,
        }
    }

    const whereConditions = [
        eq(posts.userId, userId),
        eq(posts.isDeleted, true),
    ]

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
        },
        orderBy: [desc(posts.deletedAt)],
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
    }
}

// สำหรับ admin ดู deleted posts
export const getDeletedPostsRepository = async (
    offset: number = 0,
    limit: number = 10
) => {
    const result = await db.query.posts.findMany({
        where: eq(posts.isDeleted, true),
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
        orderBy: [desc(posts.deletedAt)],
        offset,
        limit,
    })

    return result || null
}

export const getPostRepository = async (id: string) => {
    return db.query.posts.findFirst({
        where: eq(posts.id, id),
        with: {
            images: {
                orderBy: asc(postImages.displayOrder),
            },
            author: {
                columns: {
                    id: true,
                    displayName: true,
                    username: true,
                    image: true,
                },
            },
            comments: {
                orderBy: desc(posts.createdAt),
                with: {
                    author: {
                        columns: {
                            id: true,
                            displayName: true,
                            username: true,
                            image: true,
                        },
                    },
                },
            },
        },
    })
}

export const getPostImagesRepository = async (postId: string) => {
    const result = await db
        .select()
        .from(postImages)
        .where(eq(postImages.postId, postId))
        .orderBy(asc(postImages.displayOrder))

    return result
}

export const createPostRepository = async (
    data: CreatePostData
): Promise<Post> => {
    const newPost: NewPost = {
        userId: data.userId,
        content: data.content,
        visibility: data.visibility || 'public',
        createdAt: new Date(),
        updatedAt: new Date(),
    }

    const result = await db.insert(posts).values(newPost).returning()

    if (!result[0]) {
        throw new Error('Failed to create post')
    }

    return result[0] || null
}

export const softDeletePostRepository = async (
    postId: string,
    userId: string
) => {
    const result = await db
        .update(posts)
        .set({
            isDeleted: true,
            deletedAt: new Date(),
        })
        .where(
            and(
                eq(posts.id, postId),
                eq(posts.userId, userId),
                eq(posts.isDeleted, false)
            )
        )
        .returning()

    return result[0] || null
}

export const archivePostRepository = async (postId: string, userId: string) => {
    const result = await db
        .update(posts)
        .set({
            isArchived: true,
            archivedAt: new Date(),
        })
        .where(
            and(
                eq(posts.id, postId),
                eq(posts.userId, userId),
                eq(posts.isDeleted, false),
                eq(posts.isArchived, false)
            )
        )
        .returning()

    return result[0] || null
}

export const unarchivePostRepository = async (
    postId: string,
    userId: string
) => {
    const result = await db
        .update(posts)
        .set({
            isArchived: false,
            archivedAt: null,
        })
        .where(
            and(
                eq(posts.id, postId),
                eq(posts.userId, userId),
                eq(posts.isDeleted, false),
                eq(posts.isArchived, true)
            )
        )
        .returning()

    return result[0] || null
}

export const canModifyPostRepository = async (
    postId: string,
    userId: string
) => {
    try {
        const post = await db.query.posts.findFirst({
            where: and(eq(posts.id, postId), eq(posts.userId, userId)),
            columns: {
                id: true,
                isDeleted: true,
                isArchived: true,
            },
        })

        return {
            exists: !!post,
            isDeleted: post?.isDeleted || false,
            isArchived: post?.isArchived || false,
            canDelete: post && !post.isDeleted,
            canArchive: post && !post.isDeleted && !post.isArchived,
            canUnarchive: post && !post.isDeleted && post.isArchived,
        }
    } catch (error) {
        CustomLogger.error('Database error in canModifyPostRepository', {
            postId,
            userId,
            error,
        })
        throw error
    }
}
