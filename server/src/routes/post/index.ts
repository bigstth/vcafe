import { protect } from '@server/middleware/auth'
import { validateFormData, validateQuery } from '@server/middleware/validator'
import { createPostWithImagesController, getAllPostsController } from '@server/post/controller'
import { Hono } from 'hono'
import { getAllPostsSchema, createPostSchema } from './validate-schema'

const postRoutes = new Hono().get('/', protect, validateQuery(getAllPostsSchema), (c) => getAllPostsController(c)).post('/', protect, validateFormData(createPostSchema), (c) => createPostWithImagesController(c))

export default postRoutes
