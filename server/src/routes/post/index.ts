import { protect } from '@server/middleware/auth'
import {
    validateFormData,
    validateParam,
    validateQuery,
} from '@server/middleware/validator'
import {
    createPostWithImagesController,
    getPostsController,
    getPostController,
    archivePostController,
    unArchivePostController,
    deletePostController,
} from '@server/post/controller'
import { Hono } from 'hono'
import {
    getAllPostsSchema,
    createPostSchema,
    idParamSchema,
} from './validate-schema'

const postRoutes = new Hono()
    .get('/', protect, validateQuery(getAllPostsSchema), (c) =>
        getPostsController(c)
    )
    .get('/:id', protect, validateParam(idParamSchema), (c) =>
        getPostController(c)
    )
    .post('/', protect, validateFormData(createPostSchema), (c) =>
        createPostWithImagesController(c)
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

export default postRoutes
