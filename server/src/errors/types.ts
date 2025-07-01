import type { ContentfulStatusCode } from 'hono/utils/http-status'

export type ErrorResponseType = {
    en: string
    th: string
    statusName: string
    status: ContentfulStatusCode | undefined
}
