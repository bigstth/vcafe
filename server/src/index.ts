import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { appRoutes } from './routes'
import { logger } from 'hono/logger'

const app = new Hono()
    .use('*', logger())
    .route('/', appRoutes)
    .use('*', serveStatic({ root: './static' }))

export default app
