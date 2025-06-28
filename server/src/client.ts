import { hc } from 'hono/client'
import type { AppType } from './routes'

// โค้ดส่วนที่เหลือของคุณจะทำงานได้ทันทีโดยไม่ต้องแก้ไข
export type Client = ReturnType<typeof hc<AppType>>

export const hcWithType = (...args: Parameters<typeof hc>): Client => hc<AppType>(...args)
