'use client'
import React from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { useTranslations } from 'next-intl'
import { Button } from '../ui/button'
import { useAuth } from '@/contexts/auth-provider'

import './styles.css'
import AvatarRole from '../avatar-with-role-border'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const UserPopOver = () => {
    const t = useTranslations()
    const { user, signOut, isLoading } = useAuth()
    return (
        <Popover>
            <PopoverTrigger asChild className="login-popover-trigger">
                <Button
                    disabled={isLoading}
                    className="relative px-2 border-1 border-t-0 h-full rounded-2xl rounded-t-none bg-background border-border text-foreground hover:bg-accent font-medium flex flex-col gap-1 overflow-hidden  min-h-[60px] translate-y-[-4px] hover:translate-y-[-2px]"
                >
                    <AvatarRole
                        image={user?.image}
                        username={user?.username}
                        role={user?.role}
                        classNames="w-9 h-9 mt-3"
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="mt-1 mr-2 flex flex-col gap-2">
                <Link href={`/${user?.username}`}>
                    <Button className="w-full">{t('re_use.my_profile')}</Button>
                </Link>
                <Button onClick={() => signOut()} variant="outline">
                    {t('re_use.actions.sign_out')}
                </Button>
            </PopoverContent>
        </Popover>
    )
}

export default UserPopOver
