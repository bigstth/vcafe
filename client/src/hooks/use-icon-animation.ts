'use client'
import { useRef, useCallback } from 'react'
import type { HomeIconHandle } from '@/components/ui/home'

export interface IconAnimationHandlers {
    iconRefs: React.MutableRefObject<{ [key: string]: HomeIconHandle | null }>
    handleIconHover: (key: string) => void
    handleIconLeave: (key: string) => void
    createIconProps: (key: string, additionalProps?: any) => any
}

export function useIconAnimation(): IconAnimationHandlers {
    const iconRefs = useRef<{ [key: string]: HomeIconHandle | null }>({})

    const handleIconHover = useCallback((key: string) => {
        iconRefs.current[key]?.startAnimation()
    }, [])

    const handleIconLeave = useCallback((key: string) => {
        iconRefs.current[key]?.stopAnimation()
    }, [])

    const createIconProps = useCallback(
        (key: string, additionalProps = {}) => ({
            ref: (ref: HomeIconHandle) => {
                iconRefs.current[key] = ref
            },
            ...additionalProps,
        }),
        []
    )

    return {
        iconRefs,
        handleIconHover,
        handleIconLeave,
        createIconProps,
    }
}
