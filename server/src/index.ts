import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { errorHandler } from './middleware/error-handler.js'
import { appRoutes } from './routes/index.js'

const app = new Hono()
app.use('*', logger())
app.use('*', errorHandler)
app.route('/', appRoutes)

export default app
