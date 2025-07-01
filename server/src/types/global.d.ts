import type { ContentfulStatusCode } from 'hono/utils/http-status'

declare global {
    type ErrorResponseType = {
        en: string
        th: string
        statusName: string
        status: ContentfulStatusCode | undefined
    }
}

export {}
