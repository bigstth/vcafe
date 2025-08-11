import { CoffeeIcon, HomeIcon } from '@/components/ui'

export const NAVBAR_CONFIG = [
    {
        key: 'home',
        href: '/',
        icon: <HomeIcon size={24} />,
        auth: false
    },
    {
        key: 'marketplace',
        href: '/marketplace',
        icon: <CoffeeIcon size={24} />,
        auth: false
    }
]
