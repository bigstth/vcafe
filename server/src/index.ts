import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { logger } from 'hono/logger'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { errorHandler } from './middleware/error-handler'
import { appRoutes } from './routes'

const app = new Hono()
    .use('*', logger())
    .use('*', errorHandler)
    .route('/api', appRoutes)
    .use('*', serveStatic({ root: '../client/dist' }))

app.notFound(async (c) => {
    const html = await readFile(
        join(__dirname, '../../client/dist/index.html'),
        'utf-8'
    )
    return c.html(html)
})

export default app
