'use client'

import { authClient } from '@/lib/auth-client'
import type { UserProfile } from '@/types/user.type'
import React, { createContext, useContext } from 'react'
import { useGetMe } from './use-get-me'

interface AuthContextType {
    user: UserProfile | null
    isLoading: boolean
    signOut: () => Promise<void>
    signIn: {
        social: (options: {
            provider: string
            callbackURL?: string
        }) => Promise<void>
    }
    refreshUserData: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const { data: session, isPending } = authClient.useSession()

    const {
        data: userData,
        isFetching,
        refetch: refreshUserData,
    } = useGetMe({
        enabled: !!session,
    })

    React.useEffect(() => {
        if (userData) {
            setUser(userData)
        }
    }, [userData])

    const signOut = async () => {
        setIsLoading(true)
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        window.location.href = '/'
                    },
                },
            })

            setUser(null)
        } catch (error) {
            console.error('Sign out error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const signIn = {
        social: async (options: { provider: string; callbackURL?: string }) => {
            try {
                await authClient.signIn.social({
                    provider: options.provider,
                    // callbackURL: options.callbackURL || window.location.origin,
                })
            } catch (error) {
                console.error('Sign in error:', error)
                throw error
            }
        },
    }

    // Better Auth automatically handles the session state
    const contextValue: AuthContextType = {
        user: user || null,
        isLoading: isLoading || isPending || isFetching,
        signOut,
        signIn,
        refreshUserData,
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
