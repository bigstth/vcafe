import { Hono } from 'hono'
import { auth } from './lib/auth'
import { protect } from './middleware/auth'
import { getMeController } from './user/user-controller'
import { errorHandler } from './lib/error'

const appRoutes = new Hono()
    .use('*', errorHandler)
    .on(['POST', 'GET'], '/api/auth/**', (c) => auth.handler(c.req.raw))
    .get('/api/me', protect, (c) => getMeController(c))

export { appRoutes }

export type AppType = typeof appRoutes
