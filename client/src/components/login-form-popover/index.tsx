import React from 'react'
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover'
import { useTranslations } from 'next-intl'
import { Button } from '../ui/button'
import { UserIcon } from '../ui'
import { useIconAnimation } from '@/hooks/use-icon-animation'
import { LogIn } from 'lucide-react'

import './styles.css'
import { useAuth } from '@/contexts/auth-provider'

const LoginFormPopover = () => {
    const t = useTranslations()
    const { handleIconHover, handleIconLeave, createIconProps } =
        useIconAnimation()
    const { signIn, isLoading } = useAuth()

    const POPOVER_KEY = 'login-form-popover'

    const loginWithProvider = async (provider: string) => {
        signIn
            .social({
                provider,
                callbackURL: process.env.NEXT_PUBLIC_API_URL,
            })
            .catch((error) => {
                console.error('Login failed:', error)
            })
    }

    return (
        <Popover>
            <PopoverTrigger asChild className="login-popover-trigger">
                <Button
                    className="relative px-3 border-1 border-t-0 h-full rounded-2xl rounded-t-none bg-background border-border text-foreground hover:bg-accent font-medium flex flex-col gap-1 overflow-hidden  min-h-[60px] translate-y-[-4px] hover:translate-y-[-2px]"
                    onMouseEnter={() => handleIconHover(POPOVER_KEY)}
                    onMouseLeave={() => handleIconLeave(POPOVER_KEY)}
                    disabled={isLoading}
                >
                    {React.cloneElement(<UserIcon />, {
                        ...createIconProps(POPOVER_KEY, {
                            className: '[&>svg]:size-5! mt-3',
                        }),
                    })}
                    <div className="absolute bottom-0 -left-1 bg-border/50 w-20 h-5 z-1" />
                    <span className="text-xs text-background z-2">
                        {t('re_use.actions.sign_in')}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="mt-1 mr-2 flex flex-col gap-2">
                <Button
                    className="flex items-center gap-2 w-full justify-start text-[#DB4437] border-border-foreground hover:text-[#e37a71]"
                    variant="outline"
                    onClick={() => loginWithProvider('google')}
                >
                    <LogIn /> {t('navbar.actions.sign_in_with') + ' Google'}
                </Button>
                <Button
                    className="flex items-center gap-2 w-full justify-start text-[#6441A5] border-border-foreground hover:text-[#8267b5]"
                    variant="outline"
                    onClick={() => loginWithProvider('twitch')}
                >
                    <LogIn /> {t('navbar.actions.sign_in_with') + ' Twitch'}
                </Button>
                <Button
                    className="flex items-center gap-2 w-full justify-start bg-black border-border-foreground !text-white hover:bg-black/80"
                    variant="outline"
                    onClick={() => loginWithProvider('twitter')}
                >
                    <LogIn /> {t('navbar.actions.sign_in_with') + ' X'}
                </Button>
            </PopoverContent>
        </Popover>
    )
}

export default LoginFormPopover
