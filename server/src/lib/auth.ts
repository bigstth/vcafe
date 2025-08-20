import { user, session, account, verification } from '../db/user-schema.js'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import 'dotenv/config'
import { db } from '../db/db-instance.js'

export const auth = betterAuth({
    baseURL: process.env.WEBSITE_URL,
    database: drizzleAdapter(db, {
        provider: 'pg',
        schema: {
            user,
            session,
            account,
            verification
        }
    }),
    advanced: {
        crossSubDomainCookies: {
            enabled: true
        }
    },
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
            'https://www.vcafe.xyz',
            'https://www.vcafe.xyz/api',
            'https://localhost:5173',
            'https://localhost:3000'
        ],
        credentials: true
    },
    trustedOrigins: [
        'https://vcafe.xyz',
        'https://www.vcafe.xyz',
        'https://www.vcafe.xyz/api',
        'https://localhost:5173',
        'https://localhost:3000'
    ]
}) as ReturnType<typeof betterAuth>
