import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
    devIndicators: false,
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'zxfsynefrmyhoqkzjwge.supabase.co',
                port: '',
                pathname: '/storage/v1/object/public/**'
            }
        ]
    },
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`
            }
        ]
    }
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
