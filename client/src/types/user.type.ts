export type LinkedProvider = {
    provider: 'twitter' | 'credential' | 'twitch' | 'google'
    providerAccountId: string
}

export type UserProfile = {
    id: string
    name: string
    username: string
    displayUsername: string | null
    birthDate: string | null
    email: string
    emailVerified: boolean
    image: string
    createdAt: string
    updatedAt: string
    linkedProviders: LinkedProvider[]
}
