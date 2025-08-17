import { Hono } from 'hono'
import { protect } from '../../middleware/auth.js'
import { createPostRateLimit } from '../../middleware/create-post-rate-limit.js'
import {
    validateQuery,
    validateParam,
    validateFormData
} from '../../middleware/validator.js'
import {
    getPostsController,
    getPostController,
    createPostWithImagesController,
    deletePostController,
    archivePostController,
    unArchivePostController,
    getPostLikeController,
    toggleLikePostController
} from '../../post/controller.js'
import {
    getAllPostsSchema,
    idParamSchema,
    createPostSchema
} from './validate-schema.js'

const postRoutes = new Hono()
    .get('/', validateQuery(getAllPostsSchema), (c) => getPostsController(c))
    .get('/:id', protect, validateParam(idParamSchema), (c) =>
        getPostController(c)
    )
    .post(
        '/',
        protect,
        validateFormData(createPostSchema),
        createPostRateLimit,
        (c) => createPostWithImagesController(c)
    )
    .post('/delete/:id', protect, validateParam(idParamSchema), (c) =>
        deletePostController(c)
    )
    .post('/archive/:id', protect, validateParam(idParamSchema), (c) =>
        archivePostController(c)
    )
    .post('/unarchive/:id', protect, validateParam(idParamSchema), (c) =>
        unArchivePostController(c)
    )
    .get('/:id/like', protect, validateParam(idParamSchema), (c) =>
        getPostLikeController(c)
    )
    .post('/:id/like', protect, validateParam(idParamSchema), (c) =>
        toggleLikePostController(c)
    )

export default postRoutes
