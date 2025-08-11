import { create } from 'zustand'

interface GlobalErrorState {
    error: string | null
    setError: (error: string) => void
}

export const useGlobalErrorStore = create<GlobalErrorState>((set) => ({
    error: null,
    setError: (error: string) => {
        set({ error })
        setTimeout(() => {
            set({ error: null })
        }, 1000)
    }
}))
