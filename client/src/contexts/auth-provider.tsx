'use client'

import { api } from '@/lib/api-instance'
import { authClient } from '@/lib/auth-client'
import type { UserProfile } from '@/types/user.type'
import React, { createContext, useContext, useEffect } from 'react'

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<UserProfile | null>(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const { data: session, isPending, error } = authClient.useSession()

    const getMe = async () => {
        setIsLoading(true)
        try {
            const response = await api.user.me.$get()
            if (response.ok) {
                const user = await response.json()
                setUser(user as any)
            } else {
                throw new Error('Failed to fetch user')
            }
        } catch (error) {
            console.error('Failed to fetch user:', error)
            setUser(null)
        } finally {
            setIsLoading(false)
        }
    }

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
        isLoading: isLoading || isPending,
        signOut,
        signIn,
    }

    useEffect(() => {
        if (session) {
            getMe()
        }
    }, [session])

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
