import { Hono } from 'hono'
import { authRoutes } from './auth-routes'
import { postRoutes } from './post-routes'
import { userRoutes } from './user-routes'

export const appRoutes = new Hono().route('/auth', authRoutes).route('/posts', postRoutes).route('/user', userRoutes)

export type AppType = typeof appRoutes
