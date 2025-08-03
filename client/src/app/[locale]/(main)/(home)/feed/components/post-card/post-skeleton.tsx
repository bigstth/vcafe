import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const PostSkeleton = () => {
    return (
        <div className="flex gap-2 mb-6">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1  flex gap-4 flex-col">
                <Skeleton className="w-1/3 h-4" />
                <Skeleton className="w-5/6 h-4" />
                <div className="flex gap-4">
                    <Skeleton className="w-full h-40" />
                    <Skeleton className="w-full h-40" />
                </div>
            </div>
        </div>
    )
}

export default PostSkeleton
