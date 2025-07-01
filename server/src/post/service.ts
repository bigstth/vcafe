import { posts } from '@server/db'
import { db } from '@server/db/db-instance'
import { desc, asc, count } from 'drizzle-orm'
import { getAllPostsRepository, type GetPostsOptions, type GetPostsResult } from './repository'
import { AppError } from '@server/lib/error'
import { noPostFoundError } from '@server/errors/post'

export const getAllPostsService = async (options: GetPostsOptions): Promise<GetPostsResult> => {
    const posts = await getAllPostsRepository(options)

    if (!posts) {
        throw new AppError(noPostFoundError)
    }

    return posts
}
