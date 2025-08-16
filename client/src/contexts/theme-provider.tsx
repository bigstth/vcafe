'use client'
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from 'react'

type Theme = 'dark' | 'light' | 'system'

const ThemeProviderContext = createContext<
    | {
          theme: Theme
          setTheme: (theme: Theme) => void
      }
    | undefined
>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>('light')

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme
        if (savedTheme) {
            setTheme(savedTheme)
        }
    }, [])

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove('light', 'dark')

        if (theme === 'system') {
            const systemTheme = window.matchMedia(
                '(prefers-color-scheme: dark)'
            ).matches
                ? 'dark'
                : 'light'
            root.classList.add(systemTheme)
        } else {
            root.classList.add(theme)
        }

        localStorage.setItem('theme', theme)
    }, [theme])

    // Prevent hydration mismatch by not applying theme until mounted

    return (
        <ThemeProviderContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
