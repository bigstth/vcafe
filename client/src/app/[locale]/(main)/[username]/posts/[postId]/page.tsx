import React from 'react'
import { notFound } from 'next/navigation'
import PostCard from '../../../../../../components/post-card'
import { fetchPost } from '@/services/post/post'
import CommentCard from '@/components/comment-card'
import { fetchComments } from '@/services/comment/comment'
import { revalidateCommentTag } from '@/services/comment/actions'

const PostPage = async ({
    params
}: {
    params: Promise<{ postId: string }>
}) => {
    const { postId } = await params

    const post = await fetchPost(postId)
    const commentData = await fetchComments(postId)

    if (!post) {
        notFound()
    }

    return (
        <div className="w-full flex flex-col mt-4 items-center justify-center">
            <div className="w-full max-w-[600px] p-6 rounded-xl border">
                {post && (
                    <PostCard
                        post={post}
                        cardClassName="border-none rounded-none bg-background p-0"
                        contentClassName="p-0"
                    />
                )}

                <CommentCard
                    postId={post.id}
                    comments={commentData}
                    refreshComment={revalidateCommentTag}
                />
            </div>
        </div>
    )
}

export default PostPage
