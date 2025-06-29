import { Hono } from 'hono'
import { serveStatic } from 'hono/bun'
import { appRoutes } from './routes'
import { logger } from 'hono/logger'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

const app = new Hono()
    .use('*', logger())
    .route('/', appRoutes)
    .use('*', serveStatic({ root: '../client/dist' }))

app.notFound(async (c) => {
    const html = await readFile(join(__dirname, '../../client/dist/index.html'), 'utf-8')
    return c.html(html)
})

export default app
