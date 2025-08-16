import { Hono } from 'hono'
import { protect } from '../../middleware/auth.js'
import {
    validateFormData,
    validateParam,
    validateQuery
} from '../../middleware/validator.js'
import {
    getMeController,
    registerController,
    getUserController,
    getUserPostsController
} from '../../user/controller.js'
import {
    registerSchema,
    usernameSchema,
    userIdSchema,
    getUserPostsSchema
} from './validate-schema.js'

const userRoutes = new Hono()
    .get('/me', protect, getMeController)
    .post(
        '/register',
        protect,
        validateFormData(registerSchema),
        registerController
    )
    .get('/:username', validateParam(usernameSchema), (c) =>
        getUserController(c)
    )
    .get(
        '/:id/posts',
        protect,
        validateParam(userIdSchema),
        validateQuery(getUserPostsSchema),
        (c) => getUserPostsController(c)
    )

export default userRoutes
