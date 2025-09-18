import { Earth, UserLock, UserRound } from 'lucide-react'

type VisibilityOptionsType = {
    value: string
    label?: string
    icon: React.ReactNode
    active: boolean
}

export const MAX_IMAGES = 4

export const VISIBILITY_OPTIONS: Record<string, VisibilityOptionsType> = {
    public: { value: 'public', label: 'Public', icon: <Earth />, active: true },
    follower_only: {
        value: 'follower_only',
        icon: <UserRound />,
        active: true
    },
    membership_only: {
        value: 'membership_only',
        icon: <UserLock />,
        active: false
    }
}
