import { CustomLogger } from '@server/lib/custom-logger'
import { AppError } from '@server/lib/error'
import type { Context, Next } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

export const errorHandler = async (c: Context, next: Next) => {
    console.log('🔥 Error handler middleware called')
    try {
        console.log('✅ No error occurred')
        await next()
    } catch (e: unknown) {
        const requestContext: {
            path: string
            method: string
            userAgent: string | undefined
            ip: string | undefined
            timestamp: string
            userId?: string
        } = {
            path: c.req.path,
            method: c.req.method,
            userAgent: c.req.header('User-Agent'),
            ip: c.req.header('X-Forwarded-For') || c.req.header('X-Real-IP'),
            timestamp: new Date().toISOString(),
        }

        try {
            const user = c.get('user')
            if (user) {
                requestContext.userId = user.id
            }
        } catch {
            // User not available in context
        }

        if (e instanceof AppError) {
            console.log('heeeeee')
            // Log only critical AppErrors (5xx status)
            if (e.status >= 500) {
                CustomLogger.error('Critical business logic error', {
                    error: {
                        en: e.en,
                        th: e.th,
                        status: e.statusName,
                        statusCode: e.status,
                        message: e.message,
                    },
                    requestContext,
                })
            }

            return c.json(
                {
                    en: e.en,
                    th: e.th,
                    status: e.statusName,
                    message: e.message,
                },
                e.status as ContentfulStatusCode
            )
        }

        if (e instanceof Error) {
            CustomLogger.error('System error occurred', {
                message: e.message,
                stack: e.stack,
                requestContext,
            })

            return c.json(
                {
                    error: {
                        en: e.message,
                        th: 'เกิดข้อผิดพลาด',
                        status: 'internal_error',
                    },
                },
                500
            )
        }

        CustomLogger.error('Unknown error type', {
            error: String(e),
            type: typeof e,
            requestContext,
        })

        return c.json(
            {
                error: {
                    en: 'Unknown error',
                    th: 'ข้อผิดพลาดที่ไม่รู้จัก',
                    status: 'unknown_error',
                },
            },
            500
        )
    }
}
