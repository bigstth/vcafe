import { protect } from '@server/middleware/auth'
import { validateParam, validateQuery } from '@server/middleware/validator'
import {
    getMeController,
    getUserController,
    getUserPostsController,
} from '@server/user/controller'
import { Hono } from 'hono'
import { userIdSchema, getUserPostsSchema } from './validate-schema'

const userRoutes = new Hono()
    .get('/me', protect, getMeController)
    .get('/:id', validateParam(userIdSchema), (c) => getUserController(c))
    .get(
        '/:id/posts',
        protect,
        validateParam(userIdSchema),
        validateQuery(getUserPostsSchema),
        (c) => getUserPostsController(c)
    )

export default userRoutes
