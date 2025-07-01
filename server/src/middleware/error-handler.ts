import { AppError } from '@server/lib/error'
import type { Context, Next } from 'hono'

export const errorHandler = async (c: Context, next: Next) => {
    try {
        await next()
    } catch (e: unknown) {
        if (e instanceof AppError) {
            return c.json(
                {
                    error: {
                        en: e.en,
                        th: e.th,
                        status: e.statusName,
                    },
                },
                e.status,
            )
        }
        if (e instanceof Error) {
            return c.json(
                {
                    error: {
                        en: e.message,
                        th: 'เกิดข้อผิดพลาด',
                        status: 'internal_error',
                    },
                },
                500,
            )
        }
        return c.json(
            {
                error: {
                    en: 'Unknown error',
                    th: 'ข้อผิดพลาดที่ไม่รู้จัก',
                    status: 'unknown_error',
                },
            },
            500,
        )
    }
}
