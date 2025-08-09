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

export interface Comment {
    id: string;
    content: string;
    author: {
        id: string;
        name: string;
    };
    createdAt: string;
    updatedAt?: string;
}
export type GetCommentsData = Comment[]
export type CommentsSuccessData = Exclude<GetCommentsData, { error: any }>

export interface LikesData {
    likeCount: number
    hasLiked: boolean
}
export type GetLikesData = LikesData
export type LikesSuccessData = Exclude<GetLikesData, { error: any }>

export interface CreateLikeSuccessData {
    likeCount: number
    hasLiked: boolean
}
export type LikeSuccessData = {
    success: boolean
    message: string
    th: string
    en: string
}
export type PostLikeSchemaType = { postId: string }

export type commentSchemaType = {
    postId: string;
    content: string;
}