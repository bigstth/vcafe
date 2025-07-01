import { protect } from '@server/middleware/auth'
import { validateQuery } from '@server/middleware/validator'
import { getAllPostsController } from '@server/post/controller'
import { Hono } from 'hono'
import { z } from 'zod'

export const getAllPostsSchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(10),
    offset: z.coerce.number().int().nonnegative().default(0),
    orderBy: z.enum(['asc', 'desc']).default('desc'),
})
const postRoutes = new Hono().get('/', protect, validateQuery(getAllPostsSchema), (c) => getAllPostsController(c))

export { postRoutes }
