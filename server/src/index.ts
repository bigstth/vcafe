import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { errorHandler } from './middleware/error-handler'
import { appRoutes } from './routes'

const app = new Hono()
    .use('*', logger())
    .use('*', errorHandler)
    .route('/api', appRoutes)

export default app
