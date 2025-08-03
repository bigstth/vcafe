import type { api } from '@/lib/api-instance'

export type GetPostPayload = {
    limit?: number
    offset: number
    orderBy?: 'createdAt' | 'updatedAt'
}

export type GetPostsResponse = Awaited<ReturnType<typeof api.posts.$get>>
export type GetPostsData = Awaited<ReturnType<GetPostsResponse['json']>>
export type PostsSuccessData = Exclude<GetPostsData, { error: any }>
export type Posts = PostsSuccessData['posts']
export type PostItem = Posts[number]
