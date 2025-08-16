import type { api } from '@/lib/api-instance'

export type GetUser = Awaited<
    ReturnType<(typeof api.user)[':username']['$get']>
>
export type GetUserData = Awaited<ReturnType<GetUser['json']>>
export type UserSuccessData = Exclude<GetUserData, { error: any }>
