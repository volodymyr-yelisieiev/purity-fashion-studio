import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/content')({
  component: ContentAdminLayout,
})

function ContentAdminLayout() {
  return <Outlet />
}
