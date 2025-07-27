'use client'
import React from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { useTranslations } from 'next-intl'
import { Button } from '../ui/button'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import './styles.css'
import { useAuth } from '@/contexts/auth-provider'

const UserPopOver = () => {
    const t = useTranslations()

    const { user, signOut, isLoading } = useAuth()

    return (
        <Popover>
            <PopoverTrigger asChild className="login-popover-trigger">
                <Button
                    disabled={isLoading}
                    className="relative px-3 border-1 border-t-0 h-full rounded-2xl rounded-t-none bg-background border-border text-foreground hover:bg-accent font-medium flex flex-col gap-1 overflow-hidden  min-h-[60px] translate-y-[-4px] hover:translate-y-[-2px]"
                >
                    <Avatar className="[&>svg]:size-5! mt-3">
                        <AvatarImage src={user?.image} />
                        <AvatarFallback>
                            {user?.username?.[0] || 'Hi'}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="mt-1 mr-2 flex flex-col gap-2">
                <Button>{t('re_use.my_profile')}</Button>
                <Button onClick={() => signOut()} variant="outline">
                    {t('re_use.actions.sign_out')}
                </Button>
            </PopoverContent>
        </Popover>
    )
}

export default UserPopOver
