import React from 'react'
import { notFound } from 'next/navigation'
import PostCard from '../../../../../../components/post-card'
import { fetchPost } from '@/services/post/post'

type PostPageProps = {
    params: {
        username: string
        postId: string
    }
}

const PostPage = async ({ params }: PostPageProps) => {
    const { postId } = await params

    const post = await fetchPost(postId)

    if (!post) {
        notFound()
    }

    return (
        <div className="w-full flex flex-col mt-4 items-center justify-center">
            <div className="w-full max-w-[600px]">
                {post && <PostCard post={post} />}
            </div>
        </div>
    )
}

export default PostPage
