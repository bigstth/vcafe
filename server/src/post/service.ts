import { createPostRepository, getAllPostsRepository, type GetPostsOptions, type GetPostsResult } from './repository'
import { AppError } from '@server/lib/error'
import { noPostFoundError } from '@server/errors/post'

export interface CreatePostData {
    userId: string
    content: string
    visibility?: 'public' | 'follower_only' | 'membership_only'
}

export const getAllPostsService = async (options: GetPostsOptions): Promise<GetPostsResult> => {
    const posts = await getAllPostsRepository(options)

    if (!posts) {
        throw new AppError(noPostFoundError)
    }

    return posts
}

export const createPostService = async (data: CreatePostData) => {
    const { userId, content, visibility } = data

    const newPost = await createPostRepository({
        userId,
        content,
        visibility,
    })

    if (!newPost) {
        throw new AppError(noPostFoundError)
    }

    return newPost
}
