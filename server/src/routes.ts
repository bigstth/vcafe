import { Hono } from 'hono'
import type { ApiResponse } from 'shared/dist'
import { auth } from './lib/auth'

const appRoutes = new Hono()
    .get('/api/hello', async (c) => {
        const data: ApiResponse = {
            message: 'Hello BHVR!',
            success: true,
        }
        return c.json(data, { status: 200 })
    })
    .on(['POST', 'GET'], '/api/auth/**', (c) => auth.handler(c.req.raw))

export { appRoutes }

export type AppType = typeof appRoutes
