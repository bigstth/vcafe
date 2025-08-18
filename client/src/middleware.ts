import { NextRequest, NextResponse } from 'next/server'
import { match } from '@formatjs/intl-localematcher'

const locales = ['en', 'th']
const defaultLocale = 'en'

function getLocale(request: NextRequest): string {
    const localeCookie = request.cookies.get('locale')?.value
    if (localeCookie && locales.includes(localeCookie)) {
        return localeCookie
    }

    const acceptLanguage = request.headers.get('accept-language')
    if (acceptLanguage) {
        try {
            const languages = acceptLanguage
                .split(',')
                .map((lang) => {
                    const [language] = lang.split(';q=')
                    return language.trim()
                })
                .filter(Boolean)

            return match(languages, locales, defaultLocale)
        } catch (error) {
            console.warn('Error parsing Accept-Language header:', error)
            return defaultLocale
        }
    }

    return defaultLocale
}

export default function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    const pathnameHasLocale = locales.some(
        (locale) =>
            pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (pathnameHasLocale) {
        const locale = pathname.split('/')[1]
        const newPathname = pathname.slice(`/${locale}`.length) || '/'

        const response = NextResponse.redirect(
            new URL(newPathname, request.url)
        )
        response.cookies.set('locale', locale, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365
        })
        return response
    }

    const locale = getLocale(request)

    const response = NextResponse.rewrite(
        new URL(`/${locale}${pathname}`, request.url)
    )

    response.headers.set('x-locale', locale)

    if (!request.cookies.get('locale')) {
        response.cookies.set('locale', locale, {
            httpOnly: false,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365
        })
    }

    return response
}

export const config = {
    matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)']
}
