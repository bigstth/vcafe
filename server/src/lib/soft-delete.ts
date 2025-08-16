import { eq, and, type SQL } from 'drizzle-orm'
import { posts, comments } from '../db/feed-schema.js'

export const activePostsCondition = () =>
    and(eq(posts.isDeleted, false), eq(posts.isArchived, false)) as SQL<unknown>

export const activeCommentsCondition = () =>
    eq(comments.isDeleted, false) as SQL<unknown>

export const visiblePostsCondition = (includeArchived: boolean = false) => {
    if (includeArchived) {
        return eq(posts.isDeleted, false) as SQL<unknown>
    }
    return activePostsCondition() as SQL<unknown>
}

export const getDeletedPostsCondition = () =>
    eq(posts.isDeleted, true) as SQL<unknown>

export const getArchivedPostsCondition = () =>
    and(eq(posts.isDeleted, false), eq(posts.isArchived, true)) as SQL<unknown>
