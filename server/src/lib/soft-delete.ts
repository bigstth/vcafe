import { eq, and, ne, or, type SQL } from 'drizzle-orm'
import { posts, comments } from '@server/db/feed-schema'

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
