import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import '@/index.css'
import NotFound from '@/pages/notfound'

export const Route = createRootRoute({
    notFoundComponent: () => <NotFound />,
    component: () => (
        <>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
})
