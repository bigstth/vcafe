import { hcWithType } from 'server/dist/client'

export const api = hcWithType('/api', {
    headers: {
        'Content-Type': 'application/json'
    },
    init: {
        credentials: 'include'
    }
})
