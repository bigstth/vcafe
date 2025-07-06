import { Hono } from 'hono'
import authRoutes from './auth'
import postRoutes from './post'
import userRoutes from './user'
import commentRoutes from './comment'

export const appRoutes = new Hono()
    .route('/auth', authRoutes)
    .route('/posts', postRoutes)
    .route('/user', userRoutes)
    .route('/comments', commentRoutes)

export type AppType = typeof appRoutes
