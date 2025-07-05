import { db } from '@server/db/db-instance'
import { postImages, posts } from '@server/db/feed-schema'
import type { NewPost, Post } from '@server/types/schema'
import { desc, asc, count, eq } from 'drizzle-orm'

export interface GetPostsOptions {
    limit: number
    offset: number
    orderBy?: 'asc' | 'desc'
}

export interface GetPostsResult {
    posts: Post[]
    total: number
    hasMore: boolean
}

export interface CreatePostData {
    userId: string
    content: string
    visibility?: 'public' | 'follower_only' | 'membership_only'
}

export const getAllPostsRepository = async (options: GetPostsOptions): Promise<GetPostsResult> => {
    const { limit, offset, orderBy = 'desc' } = options

    const result = await db
        .select()
        .from(posts)
        .orderBy(orderBy === 'desc' ? desc(posts.createdAt) : asc(posts.createdAt))
        .limit(limit)
        .offset(offset)

    const totalQuery = await db.select({ count: count() }).from(posts)

    const total = totalQuery[0]?.count || 0
    const hasMore = offset + limit < total

    return {
        posts: result,
        total,
        hasMore,
    }
}

export const getPostRepository = async (id: string): Promise<Post | undefined> => {
    return db
        .select()
        .from(posts)
        .where(eq(posts.id, id))
        .limit(1)
        .then((result) => result[0])
}

export const getPostImagesRepository = async (postId: string) => {
    const result = await db.select().from(postImages).where(eq(postImages.postId, postId)).orderBy(asc(postImages.displayOrder))

    return result
}

export const createPostRepository = async (data: CreatePostData): Promise<Post> => {
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

    return result[0]
}
