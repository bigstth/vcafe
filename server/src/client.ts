import { hc } from 'hono/client'
import type { AppType } from './routes/index.js'

export type Client = ReturnType<typeof hc<AppType>>

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
    hc<AppType>(...args)
