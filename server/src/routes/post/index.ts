import { protect } from '@server/middleware/auth'
import { validateJson, validateQuery } from '@server/middleware/validator'
import { createPostController, getAllPostsController } from '@server/post/controller'
import { Hono } from 'hono'
import { getAllPostsSchema, createPostSchema } from './validate-schema'

const postRoutes = new Hono().get('/', protect, validateQuery(getAllPostsSchema), (c) => getAllPostsController(c)).post('/', protect, validateJson(createPostSchema), (c) => createPostController(c))

export default postRoutes
