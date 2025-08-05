import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest, NextResponse } from 'next/server'

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    // If already has locale, continue
    if (/^\/(en|th)(\/|$)/.test(pathname)) {
        return createMiddleware({ ...routing, localePrefix: 'never' })(request)
    }
    // Only redirect on root path
    if (pathname === '/' || pathname === '') {
        const acceptLang = request.headers.get('accept-language') || ''
        const isThai = acceptLang.toLowerCase().startsWith('th')
        const locale = isThai ? 'th' : 'en'
        return NextResponse.redirect(new URL(`/${locale}`, request.url))
    }
    // Fallback to default middleware
    return createMiddleware({ ...routing, localePrefix: 'never' })(request)
}

export const config = {
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
}
