import type { UserProfile } from '@/types/user.type'

export const getBorderColorByRole = (role: UserProfile['role'] | string) => {
    switch (role) {
        case 'gold':
            return 'border-gold'
        case 'sapphire':
            return 'border-sapphire'
        case 'emerald':
            return 'border-emerald'
        case 'ruby':
            return 'border-ruby'
        default:
            return 'border-silver'
    }
}
export const getTextColorByRole = (role: UserProfile['role'] | string) => {
    switch (role) {
        case 'gold':
            return 'text-gold'
        case 'sapphire':
            return 'text-sapphire'
        case 'emerald':
            return 'text-emerald'
        case 'ruby':
            return 'text-ruby'
        default:
            return 'text-silver'
    }
}
