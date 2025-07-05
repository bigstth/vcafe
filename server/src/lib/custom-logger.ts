export const CustomLogger = {
    info: (message: string, data?: any) => {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data, null, 2) : '')
    },
    error: (message: string, error?: any) => {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error?.stack || error)
    },
    warn: (message: string, data?: any) => {
        console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data, null, 2) : '')
    },
    debug: (message: string, data?: any) => {
        console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data, null, 2) : '')
    },
}
