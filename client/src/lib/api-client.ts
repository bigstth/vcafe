type ApiOptions = RequestInit & { params?: Record<string, any> }

function buildUrl(url: string, params?: Record<string, any>) {
    if (!params) return url
    const query = new URLSearchParams(params).toString()
    return `${url}?${query}`
}

export const api = {
    get: async <T>(url: string, options?: ApiOptions): Promise<T> => {
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
