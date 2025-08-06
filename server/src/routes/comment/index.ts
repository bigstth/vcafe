import { protect } from '@server/middleware/auth'
import { validateJson, validateParam } from '@server/middleware/validator'
import { Hono } from 'hono'
import { createCommentSchema, getCommentsSchema } from './validate-schema'
import { createCommentController, getCommentsController } from '@server/comment/controller'

const commentRoutes = new Hono()
    .get(
        '/post/:postId',
        protect,
        validateParam(getCommentsSchema),
        (c) => getCommentsController(c)
    )
    .post(
        '/post/:postId',
        protect,
        validateParam(getCommentsSchema),
        validateJson(createCommentSchema),
        (c) => createCommentController(c)
    )

export default commentRoutes
