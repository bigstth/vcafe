import { db } from '@server/db/db-instance'
import { user, session, account, verification } from '../db/user-schema'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import 'dotenv/config'

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: {
            user,
            session,
            account,
            verification
        }
    }),
    rateLimit: {
        enabled: true,
        window: 10,
        max: 20,
        storage: 'memory',
        modelName: 'rateLimit'
    },
    emailAndPassword: {
        enabled: true
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        },
        twitch: {
            clientId: process.env.TWITCH_CLIENT_ID!,
            clientSecret: process.env.TWITCH_CLIENT_SECRET!
        },
        twitter: {
            clientId: process.env.TWITTER_CLIENT_ID!,
            clientSecret: process.env.TWITTER_CLIENT_SECRET!
        }
    },
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ['google', 'twitch', 'twitter']
        }
    },
    cors: {
        origin: [
            'https://vcafe.xyz',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://localhost:3000',
            'https://vcafe.vercel.app'
        ],
        credentials: true
    },
    trustedOrigins: [
        'https://vcafe.xyz',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',
        'https://vcafe.vercel.app'
    ]
}) as ReturnType<typeof betterAuth>
