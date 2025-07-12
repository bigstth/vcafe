import { Hono } from 'hono'
import authRoutes from './auth'
import postRoutes from './post'
import userRoutes from './user'
import commentRoutes from './comment'
import followRoutes from './follow'

export const appRoutes = new Hono()
    .route('/auth', authRoutes)
    .route('/posts', postRoutes)
    .route('/user', userRoutes)
    .route('/comments', commentRoutes)
    .route('/follow', followRoutes)

export type AppType = typeof appRoutes
