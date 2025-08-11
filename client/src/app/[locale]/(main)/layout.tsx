import '../../globals.css'
import Navbar from '@/components/navbar'

export default function MainLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Navbar />
            <main className="px-5 py-4">{children}</main>
        </>
    )
}
