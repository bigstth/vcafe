type ApiOptions = RequestInit & { params?: Record<string, any> }

function buildUrl(url: string, params?: Record<string, any>) {
    const isAbsolute = url.startsWith('http')
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
    const fullUrl = isAbsolute ? url : baseUrl + url
    if (!params || Object.keys(params).length === 0) return fullUrl
    const query = new URLSearchParams(params).toString()
    return `${fullUrl}?${query}`
}

export const api = {
    get: async <T>(url: string, options?: ApiOptions): Promise<T> => {
        console.log(buildUrl(url, options?.params), 'urlzaza')
        const response = await fetch(buildUrl(url, options?.params), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(options?.headers || {})
            },
            credentials: 'include',
            ...options
        })
        return response.json()
    },
    post: async <T>(
        url: string,
        body?: any,
        options?: ApiOptions
    ): Promise<T> => {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(options?.headers || {})
            },
            credentials: 'include',
            body: JSON.stringify(body),
            ...options
        })
        return response.json()
    },
    put: async <T>(
        url: string,
        body?: any,
        options?: ApiOptions
    ): Promise<T> => {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...(options?.headers || {})
            },
            credentials: 'include',
            body: JSON.stringify(body),
            ...options
        })
        return response.json()
    },
    delete: async <T>(url: string, options?: ApiOptions): Promise<T> => {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...(options?.headers || {})
            },
            credentials: 'include',
            ...options
        })
        return response.json()
    }
}
