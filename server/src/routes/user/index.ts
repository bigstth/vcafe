import { protect } from '@server/middleware/auth'
import {
    validateFormData,
    validateParam,
    validateQuery,
} from '@server/middleware/validator'
import {
    getMeController,
    getUserController,
    getUserPostsController,
    registerController,
} from '@server/user/controller'
import { Hono } from 'hono'
import {
    userIdSchema,
    getUserPostsSchema,
    registerSchema,
} from './validate-schema'

const userRoutes = new Hono()
    .get('/me', protect, getMeController)
    .post(
        '/register',
        protect,
        validateFormData(registerSchema),
        registerController
    )
    .get('/:id', validateParam(userIdSchema), (c) => getUserController(c))
    .get(
        '/:id/posts',
        protect,
        validateParam(userIdSchema),
        validateQuery(getUserPostsSchema),
        (c) => getUserPostsController(c)
    )

export default userRoutes
