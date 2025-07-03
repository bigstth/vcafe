import { posts } from '@server/db/feed-schema'

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
