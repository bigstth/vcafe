import { user, session, account, verification } from '../db/schema'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'

const db = drizzle(process.env.DATABASE_URL!)

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: {
            user,
            session,
            account,
            verification,
        },
    }),
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
        // twitch: {
        //     clientId: process.env.TWITCH_CLIENT_ID!,
        //     clientSecret: process.env.TWITCH_CLIENT_SECRET!,
        // },
        // twitter: {
        //     clientId: process.env.TWITTER_CLIENT_ID!,
        //     clientSecret: process.env.TWITTER_CLIENT_SECRET!,
        // },
    },
    cors: {
        origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
        credentials: true,
    },
    trustedOrigins: ['http://localhost:5173', 'http://127.0.0.1:5173'],
})
