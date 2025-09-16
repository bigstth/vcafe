import type { Post } from '@/app/[locale]/(main)/(home)/feed/types'
import PostCard from '@/components/post-card'
import { fetchUserPosts } from '@/services/user/user.service'
import React from 'react'

const UserPosts = async ({ userId }: { userId: string }) => {
    const data = await fetchUserPosts(userId, {
        limit: 10
    })

    return (
        <div className="mt-2 flex flex-col gap-4 max-w-[600px]">
            {data?.posts.map((post: Post) => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    )
}

export default UserPosts
