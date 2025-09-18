export interface CreateCommentResponse {
    id: string
    content: string
    userId: string
    postId: string
    isDeleted: boolean
    deletedAt: string | null
    createdAt: string
    updatedAt: string
}

export interface CommentAuthor {
    id: string
    name: string
    username: string
    image: string
    role: string
}

export interface Comment {
    id: string
    content: string
    userId: string
    postId: string
    isDeleted: boolean
    deletedAt: string | null
    createdAt: string
    updatedAt: string
    author: CommentAuthor
}

export type CommentList = Comment[]
