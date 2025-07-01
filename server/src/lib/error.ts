import type { ContentfulStatusCode } from 'hono/utils/http-status'
import type { Context, Next } from 'hono'

export class AppError extends Error {
    en: string
    th: string
    statusName: string
    status: ContentfulStatusCode

    constructor({ en, th, statusName, status = 400 }: { en: string; th: string; statusName: string; status?: ContentfulStatusCode }) {
        super(en)
        this.en = en
        this.th = th
        this.statusName = statusName
        this.status = status
    }
}

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

export const somethingWentWrong = (c: Context) => {
    return c.json(
        {
            error: {
                en: 'Something went wrong',
                th: 'เกิดข้อผิดพลาด',
                status: 'internal_error',
            },
        },
        500,
    )
}

export const errorResponseFormat = (c: Context, e: unknown) => {
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

    return somethingWentWrong(c)
}
