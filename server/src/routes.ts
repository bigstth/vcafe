import { Hono } from 'hono'
import type { ApiResponse } from 'shared/dist'

const appRoutes = new Hono().get('/api/hello', async (c) => {
    const data: ApiResponse = {
        message: 'Hello BHVR!',
        success: true,
    }
    return c.json(data, { status: 200 })
})

export { appRoutes }

export type AppType = typeof appRoutes
