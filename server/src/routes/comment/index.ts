import { Hono } from 'hono'
import {
    getCommentsController,
    createCommentController
} from '../../comment/controller.js'
import { protect } from '../../middleware/auth.js'
import { validateParam, validateJson } from '../../middleware/validator.js'
import { getCommentsSchema, createCommentSchema } from './validate-schema.js'

const commentRoutes = new Hono()
    .get('/post/:postId', protect, validateParam(getCommentsSchema), (c) =>
        getCommentsController(c)
    )
    .post(
        '/post/:postId',
        protect,
        validateParam(getCommentsSchema),
        validateJson(createCommentSchema),
        (c) => createCommentController(c)
    )

export default commentRoutes
