'use client'
import React from 'react'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useGlobalError } from '@/hooks/use-global-error'

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = React.useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 0,
                        refetchOnWindowFocus: false,
                        retry: false
                    }
                }
            })
    )

    useGlobalError()

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    )
}

export default QueryProvider
