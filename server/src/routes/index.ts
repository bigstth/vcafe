import { Hono } from 'hono'
import authRoutes from './auth'
import postRoutes from './post'
import userRoutes from './user'

export const appRoutes = new Hono().route('/auth', authRoutes).route('/posts', postRoutes).route('/user', userRoutes)

export type AppType = typeof appRoutes
