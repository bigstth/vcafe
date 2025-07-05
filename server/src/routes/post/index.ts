import { protect } from '@server/middleware/auth'
import { validateFormData, validateParam, validateQuery } from '@server/middleware/validator'
import { createPostWithImagesController, getAllPostsController, getPostController } from '@server/post/controller'
import { Hono } from 'hono'
import { getAllPostsSchema, createPostSchema, getPostSchema } from './validate-schema'

const postRoutes = new Hono()
    .get('/', protect, validateQuery(getAllPostsSchema), (c) => getAllPostsController(c))
    .get('/:id', protect, validateParam(getPostSchema), (c) => getPostController(c))
    .post('/', protect, validateFormData(createPostSchema), (c) => createPostWithImagesController(c))

export default postRoutes
