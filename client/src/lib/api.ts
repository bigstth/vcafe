import { hcWithType } from 'server/dist/client'

const client = hcWithType('/')

export const api = client.api
