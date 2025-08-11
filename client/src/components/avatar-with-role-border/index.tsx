import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { cn } from '@/lib/utils'
import type { UserProfile } from '@/types/user.type'
import { getBorderColorByRole } from '@/lib/role-preference'

const AvatarRole = ({
    image,
    username,
    role = 'gold',
    classNames = ''
}: {
    image?: string
    username?: string | null
    role?: UserProfile['role'] | string
    classNames?: string
}) => {
    return (
        <Avatar
            className={cn(
                'w-10 h-10 border-2',
                getBorderColorByRole(role),
                classNames
            )}
        >
            <AvatarImage src={image || undefined} />
            <AvatarFallback>{username?.[0] || 'Hi'}</AvatarFallback>
        </Avatar>
    )
}

export default AvatarRole
