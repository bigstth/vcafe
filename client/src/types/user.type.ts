export type LinkedProvider = {
    provider: 'twitter' | 'credential' | 'twitch' | 'google'
    providerAccountId: string
}

export type UserProfile = {
    id: string
    name: string
    username: string
    bio: string
    role?: ['silver' | 'gold' | 'ruby' | 'emerald' | 'sapphire'] | string
    displayUsername: string | null
    birthDate: string | null
    email: string
    emailVerified: boolean
    image: string
    createdAt: string
    updatedAt: string
    linkedProviders: LinkedProvider[]
}
