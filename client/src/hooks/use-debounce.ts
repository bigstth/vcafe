import { useCallback, useRef } from 'react'
import { debounce } from 'lodash'

export const useDebounce = <T extends (...args: any[]) => any>(
    callback: T,
    delay: number,
    options?: { leading?: boolean; trailing?: boolean }
) => {
    const callbackRef = useRef(callback)
    callbackRef.current = callback

    return useCallback(
        debounce(
            (...args: Parameters<T>) => callbackRef.current(...args),
            delay,
            options
        ),
        [delay, options?.leading, options?.trailing]
    )
}
