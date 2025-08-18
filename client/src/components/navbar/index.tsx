'use client'
import {
    NavigationMenu,
    NavigationMenuLink
} from '@/components/ui/navigation-menu'
import { Button } from '../ui/button'
import { Globe, Menu, MoonStar, Sun } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { NAVBAR_CONFIG } from '@/lib/config'
import { useTheme } from '@/hooks/use-theme'
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import type { HomeIconHandle } from '@/components/ui/home'
import LoginFormPopover from '../login-form-popover'
import { useIconAnimation } from '@/hooks/use-icon-animation'
import { useAuth } from '@/contexts/auth-provider'
import UserPopOver from '../user-popover'
import { useChangeLocale } from '@/lib/change-locale'

const Navbar = () => {
    const router = useRouter()
    const pathname = usePathname()
    const locale = useLocale()
    const t = useTranslations('navbar')
    const { theme, toggleTheme } = useTheme()
    const { user, isLoading } = useAuth()

    const [open, setOpen] = useState(false)

    const menuRef = useRef<HTMLDivElement>(null)

    const { iconRefs, handleIconHover, handleIconLeave } = useIconAnimation()

    const isActive = (href: string) => {
        const segments = pathname.split('/')
        const pathWithoutLocale = '/' + segments.slice(2).join('/')
        return (
            pathWithoutLocale === href ||
            pathWithoutLocale.startsWith(href + '/')
        )
    }

    const { changeLocale } = useChangeLocale()

    useEffect(() => {
        setOpen(false)
    }, [pathname])

    const handleMenuToggle = () => {
        if (open && menuRef.current) {
            menuRef.current.classList.add(
                'animate-out',
                'fade-out',
                'slide-out-to-top-4'
            )
            setTimeout(() => {
                setOpen(false)
                if (menuRef.current) {
                    menuRef.current.classList.remove(
                        'animate-out',
                        'fade-out',
                        'slide-out-to-top-4'
                    )
                }
            }, 150)
        } else {
            setOpen(true)
        }
    }

    return (
        <div className="relative w-full h-12 bg-background shadow-md flex items-center justify-between px-4">
            <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => router.push('/')}
            >
                <Image
                    src="/logo.png"
                    alt="Mairu Logo"
                    width={96}
                    height={40}
                    priority
                />
            </div>
            <div className="md:hidden">
                <Button
                    variant="ghost"
                    className="!p-0 flex items-center justify-center"
                    onClick={handleMenuToggle}
                    aria-label="Open menu"
                >
                    <Menu className="!w-6 !h-6 !p-0" />
                </Button>
            </div>
            <NavigationMenu className="hidden md:flex w-auto h-full items-center justify-between gap-2">
                <div className="h-full flex items-stretch gap-2">
                    {NAVBAR_CONFIG.map((item) => (
                        <NavigationMenuLink
                            key={item.href}
                            asChild
                            className="w-full h-full min-h-[60px] -translate-y-[10px] hover:translate-y-[-8px]"
                        >
                            <Link
                                href={item.href}
                                className={cn(
                                    'px-3 py-1 flex items-center text-xs justify-center rounded-b-2xl rounded-t-none transition-all duration-200 border-1 border-t-0',
                                    isActive(item.href)
                                        ? 'bg-accent text-accent-foreground'
                                        : 'border-1 border-t-0 hover:bg-accent'
                                )}
                                aria-current={
                                    isActive(item.href) ? 'page' : undefined
                                }
                                onMouseEnter={() => handleIconHover(item.href)}
                                onMouseLeave={() => handleIconLeave(item.href)}
                            >
                                {React.cloneElement(item.icon, {
                                    ref: (ref: HomeIconHandle) => {
                                        iconRefs.current[item.href] = ref
                                    },
                                    size: 20,
                                    className: `[&>svg]:size-5! ${
                                        isActive(item.href)
                                            ? ' [&>svg]:text-primary!'
                                            : ' [&>svg]:text-primary-foreground!'
                                    }`
                                })}
                            </Link>
                        </NavigationMenuLink>
                    ))}
                </div>
                <Button
                    variant="ghost"
                    className={cn(
                        'group min-h-[60px] -translate-y-[4px] hover:translate-y-[-2px] px-3 py-1 flex items-center text-xs justify-center rounded-b-2xl rounded-t-none transition-all duration-200 border-1 border-t-0'
                    )}
                    onClick={() => changeLocale(locale === 'th' ? 'en' : 'th')}
                >
                    <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
                        <Globe
                            size={20}
                            className="absolute transition-all duration-300 ease-in-out group-hover:opacity-0 group-hover:scale-75 group-hover:rotate-12 mt-1"
                        />
                        <span className="absolute text-xs font-semibold transition-all duration-300 ease-in-out opacity-0 scale-75 -rotate-12 group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0">
                            {locale === 'th' ? 'TH' : 'EN'}
                        </span>
                    </div>
                </Button>
                {!user && !isLoading ? <LoginFormPopover /> : <UserPopOver />}
            </NavigationMenu>
            {open && (
                <div
                    ref={menuRef}
                    className="absolute top-16 left-0 right-0 w-full bg-background shadow-md flex flex-col items-start px-4 py-2 z-50 md:hidden transition-all duration-200 animate-in fade-in slide-in-from-top-4"
                >
                    <NavigationMenu
                        className="flex flex-col max-w-full w-full gap-2 items-center"
                        orientation="vertical"
                    >
                        <div className="flex flex-col w-full gap-2 text-center">
                            {NAVBAR_CONFIG.map((item) => (
                                <NavigationMenuLink key={item.href} asChild>
                                    <Link
                                        href={item.href}
                                        className={`flex gap-2 items-center flex-row px-4 py-2 text-sm font-medium border-1 mb-2 hover:bg-accent/50 transition-all duration-200 ${
                                            isActive(item.href)
                                                ? 'border-primary text-primary'
                                                : ''
                                        }`}
                                    >
                                        {React.cloneElement(item.icon, {
                                            className: `[&>svg]:size-5! ${
                                                isActive(item.href)
                                                    ? ' [&>svg]:text-primary!'
                                                    : ' [&>svg]:text-primary-foreground!'
                                            }`
                                        })}
                                        {t(item.key)}
                                    </Link>
                                </NavigationMenuLink>
                            ))}
                        </div>
                        <div className="w-full flex gap-2 items-center justify-center my-4">
                            <Button
                                variant="ghost"
                                className="border-1 rounded-sm"
                                onClick={toggleTheme}
                            >
                                {theme === 'dark' ? <MoonStar /> : <Sun />}
                            </Button>
                            <Button
                                onClick={() =>
                                    changeLocale(locale === 'th' ? 'en' : 'th')
                                }
                            >
                                {locale === 'th' ? 'TH' : 'EN'}
                            </Button>
                        </div>
                    </NavigationMenu>
                </div>
            )}
        </div>
    )
}

export default Navbar
