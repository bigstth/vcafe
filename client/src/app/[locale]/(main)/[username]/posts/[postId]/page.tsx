'use client'
import React from 'react'
import { notFound, useParams } from 'next/navigation'
import { useGetPosts } from './use-get-post'
import PostCard from '../../../(home)/feed/components/post-card'

const PostPage = () => {
    const { postId } = useParams<{
        username: string
        postId: string
    }>()

    const { data: post, isFetching } = useGetPosts(postId)

    if (!isFetching && !post) {
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
