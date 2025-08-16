import { Hono } from 'hono'
import authRoutes from './auth/index.js'
import commentRoutes from './comment/index.js'
import followRoutes from './follow/index.js'
import postRoutes from './post/index.js'
import userRoutes from './user/index.js'

export const appRoutes = new Hono()
    .route('/auth', authRoutes)
    .route('/posts', postRoutes)
    .route('/user', userRoutes)
    .route('/comments', commentRoutes)
    .route('/follow', followRoutes)

export type AppType = typeof appRoutes
