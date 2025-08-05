import type { api } from '@/lib/api-instance'

export type GetSinglePostResponse = Awaited<
    ReturnType<(typeof api.posts)[':id']['$get']>
>
export type GetSinglePostData = Awaited<
    ReturnType<GetSinglePostResponse['json']>
>
export type SinglePostSuccessData = Exclude<GetSinglePostData, { error: any }>
