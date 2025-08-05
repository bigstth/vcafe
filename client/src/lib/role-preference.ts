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
