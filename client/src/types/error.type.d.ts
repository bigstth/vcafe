type ValidateFieldError = {
    field: string
    message: string
    received: string
}

type ErrorResponse = {
    error: {
        message?: string
        code: number
        status: string
        details?: ValidateFieldError[]
        th?: string
        en?: string
    }
}
