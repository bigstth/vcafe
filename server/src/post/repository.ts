import { db } from '@server/db/db-instance'
import { posts } from '@server/db/feed-schema'
import { desc, asc, count } from 'drizzle-orm'

type Post = typeof posts.$inferSelect
type NewPost = typeof posts.$inferInsert

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
    id: string
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

export const createPostRepository = async (data: CreatePostData): Promise<Post> => {
    const newPost: NewPost = {
        id: data.id,
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

export const getPostByIdRepository = async (id: string): Promise<Post | undefined> => {
    return db.query.posts.findFirst({
        where: (p, { eq }) => eq(p.id, id),
    })
}
