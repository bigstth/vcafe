import '../globals.css'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { AuthProvider } from '@/contexts/auth-provider'
import { ThemeProvider } from '@/contexts/theme-provider'
import UpdateUserInfoDialog from '@/components/update-user-info-dialog'

export const metadata = async ({ params }: { params: { locale: string } }) => {
    const t = await getTranslations({
        locale: params?.locale,
        namespace: 'meta',
    })
    return {
        title: t('title'),
        description: t('description'),
    }
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}) {
    const { locale } = await params
    if (!hasLocale(routing.locales, locale)) {
        notFound()
    }
    return (
        <html lang={locale}>
            <head></head>
            <body className="antialiased">
                <NextIntlClientProvider>
                    <ThemeProvider>
                        <AuthProvider>
                            {children}
                            <UpdateUserInfoDialog />
                        </AuthProvider>
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
