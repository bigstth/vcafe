import { protect } from '@server/middleware/auth'
import { getMeController } from '@server/user/controller'
import { Hono } from 'hono'

const userRoutes = new Hono().get('/me', protect, getMeController)

export { userRoutes }
