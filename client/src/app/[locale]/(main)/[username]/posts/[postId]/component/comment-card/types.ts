import { api } from '@/lib/api-instance';

export type GetCommentsResponse = Awaited<ReturnType<typeof api.posts.$get>>
export type GetCommentsData = Awaited<ReturnType<GetCommentsResponse['json']>>
export type CommentsSuccessData = Exclude<GetCommentsData, { error: any }>
export type Comment = CommentsSuccessData['posts'][number]