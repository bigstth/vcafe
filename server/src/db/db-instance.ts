import { drizzle } from 'drizzle-orm/node-postgres'
import * as schema from './index'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL!
const client = new Pool({ connectionString })
export const db = drizzle(client, { schema })
