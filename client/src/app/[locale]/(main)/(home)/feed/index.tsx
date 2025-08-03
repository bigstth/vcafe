'use client'
import React, { useState } from 'react'
import { useGetPosts } from './use-get-post'
import CreatePostComponent from './components/create-post'
import PostCard from './components/post-card'
import PostSkeleton from './components/post-card/post-skeleton'

const Feed = () => {
    const [pagination, setPagination] = useState({ offset: 0, limit: 10 })
    const { data: posts, isFetching } = useGetPosts(pagination)

    return (
        <div className="w-full max-w-[600px]">
            <CreatePostComponent />

            <div className="mt-8 flex flex-col gap-4">
                {isFetching ? (
                    <>
                        <PostSkeleton />
                        <PostSkeleton />
                    </>
                ) : (
                    posts?.posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))
                )}
            </div>
        </div>
    )
}

export default Feed
