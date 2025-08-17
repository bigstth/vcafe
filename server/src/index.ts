import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { errorHandler } from './middleware/error-handler.js'
import { appRoutes } from './routes/index.js'

const app = new Hono()
    .use('*', logger())
    .use('*', errorHandler)
    .route('/api', appRoutes)

export default app
