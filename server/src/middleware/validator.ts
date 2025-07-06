import type { Context, Next } from 'hono'
import type { ZodSchema } from 'zod'

export const validateQuery = <T extends ZodSchema>(schema: T) => {
    return async (c: Context, next: Next) => {
        const queryData = c.req.query()
        const result = schema.safeParse(queryData)

        if (!result.success) {
            return c.json(
                {
                    status: 'validation_error',
                    message: 'Query parameters validation failed',
                    details: result.error.errors.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                        received: err.path.reduce(
                            (obj: any, key) => obj?.[key],
                            queryData
                        ),
                    })),
                },
                400
            )
        }

        c.set('validatedQuery', result.data)
        await next()
    }
}

export const validateJson = <T extends ZodSchema>(schema: T) => {
    return async (c: Context, next: Next) => {
        const jsonData = await c.req.json()
        const result = schema.safeParse(jsonData)

        if (!result.success) {
            return c.json(
                {
                    status: 'validation_error',
                    message: 'JSON body validation failed',
                    details: result.error.errors.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                        received: err.path.reduce(
                            (obj: any, key) => obj?.[key],
                            jsonData
                        ),
                    })),
                },
                400
            )
        }

        c.set('validatedJson', result.data)
        await next()
    }
}

export const validateParam = <T extends ZodSchema>(schema: T) => {
    return async (c: Context, next: Next) => {
        const paramData = c.req.param()
        const result = schema.safeParse(paramData)

        if (!result.success) {
            return c.json(
                {
                    status: 'validation_error',
                    message: 'Path parameters validation failed',
                    details: result.error.errors.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                        received: err.path.reduce(
                            (obj: any, key) => obj?.[key],
                            paramData
                        ),
                    })),
                },
                400
            )
        }

        c.set('validatedParam', result.data)
        await next()
    }
}

export const validateFormData = <T extends ZodSchema>(schema: T) => {
    return async (c: Context, next: Next) => {
        try {
            const formData = await c.req.formData()
            const formObject: Record<string, any> = {}
            const imageFiles: File[] = []

            for (const [key, value] of formData.entries()) {
                if (
                    value &&
                    typeof value === 'object' &&
                    'name' in value &&
                    'size' in value
                ) {
                    const file = value as File
                    if (key.startsWith('images')) {
                        imageFiles.push(file)
                    } else {
                        formObject[key] = file
                    }
                } else {
                    const textValue = value as string
                    if (formObject[key]) {
                        if (!Array.isArray(formObject[key])) {
                            formObject[key] = [formObject[key]]
                        }
                        formObject[key].push(textValue)
                    } else {
                        formObject[key] = textValue
                    }
                }
            }

            if (imageFiles.length > 0) {
                formObject.images = imageFiles
            }

            const result = schema.safeParse(formObject)

            if (!result.success) {
                return c.json(
                    {
                        status: 'validation_error',
                        message: 'Form data validation failed',
                        details: result.error.errors.map((err) => ({
                            field: err.path.join('.'),
                            message: err.message,
                            received: err.path.reduce(
                                (obj: any, key) => obj?.[key],
                                formObject
                            ),
                        })),
                    },
                    400
                )
            }
            c.set('validatedFormData', result.data)
            await next()
        } catch (error) {
            return c.json(
                {
                    status: 'parse_error',
                    message: 'Failed to parse form data',
                },
                400
            )
        }
    }
}
