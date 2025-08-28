export type GetPostPayload = {
    limit?: number
    offset: number
    orderBy?: 'createdAt' | 'updatedAt'
}

interface User {
    id: string
    username: string
    displayUsername: string
    bio: string | null
    role: 'ruby' | 'silver'
    image: string
}

interface Like {
    userId: string
    postId: string
    createdAt: string
}

export interface Post {
    id: string
    userId: string
    content: string
    visibility: 'public' | 'follower_only' | 'membership_only'
    isDeleted: boolean
    isArchived: boolean
    deletedAt: string | null
    archivedAt: string | null
    createdAt: string
    updatedAt: string
    author: User
    images: Image[]
    comments: Comment[]
    likes: Like[]
}

export interface PostResponse {
    posts: Post[]
    total: number
    hasMore: boolean
}

export interface Comment {
    id: string
    content: string
    author: {
        id: string
        username: string
        displayUsername: string
        bio: string
        role: string
        image: string
    }
    createdAt: string
    updatedAt?: string
}
export type Comments = Comment[]

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

export type CommentSchemaType = {
    postId: string
    content: string
}
