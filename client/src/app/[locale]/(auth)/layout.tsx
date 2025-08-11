import type { Metadata } from 'next'
import '../../globals.css'

export const metadata: Metadata = {
    title: '=^._.^= ~ Mairu z',
    description: `I don't know what to do, but I want to serve you.`
}

export default function AuthLayout({
    children
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}
