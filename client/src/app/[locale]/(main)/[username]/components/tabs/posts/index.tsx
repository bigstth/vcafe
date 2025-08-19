'use client'
import PostCard from '@/components/post-card'
import { useGetUserPosts } from '@/hooks/user/use-get-user-posts'
import React from 'react'

const UserPosts = ({ userId }: { userId: string }) => {
    const { data } = useGetUserPosts(userId, { limit: 10 })
    return (
        <div className="mt-2 flex flex-col gap-4 max-w-[600px]">
            {data?.posts.map((post: any) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    )
}

export default UserPosts
