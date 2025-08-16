import type { postImages, posts } from '../db/index.js'

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
export type PostImages = typeof postImages.$inferSelect
export type NewPostImages = typeof postImages.$inferInsert
