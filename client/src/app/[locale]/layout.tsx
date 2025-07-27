import '../globals.css'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ThemeProvider } from '@/contexts/theme-provider'
import UpdateUserInfoDialog from '@/components/update-user-info-dialog'
import { AuthProvider } from '@/contexts/auth-provider'
import QueryProvider from '@/contexts/query-provider'
import { Toaster } from '@/components/ui/sonner'

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
                        <QueryProvider>
                            <AuthProvider>
                                {children}
                                <Toaster
                                    position="top-center"
                                    toastOptions={{
                                        unstyled: true,
                                        classNames: {
                                            default:
                                                'bg-background/90 border !text-foreground rounded-lg py-2 px-4 shadow-lg text-white w-96 flex gap-4 items-center',
                                            success:
                                                'bg-primary/90 border !text-foreground rounded-lg py-2 px-4 shadow-lg text-white w-96 flex gap-4 items-center',
                                            warning:
                                                'bg-secondary/90 border !text-foreground rounded-lg py-2 px-4 shadow-lg text-white w-96 flex gap-4 items-center',
                                            error: 'bg-destructive/90 border !text-foreground rounded-lg py-2 px-4 shadow-lg text-white w-96 flex gap-4 items-center',
                                        },
                                    }}
                                />
                                <UpdateUserInfoDialog />
                            </AuthProvider>
                        </QueryProvider>
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
