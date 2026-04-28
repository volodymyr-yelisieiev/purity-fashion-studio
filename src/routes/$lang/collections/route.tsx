import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/collections')({
  component: Outlet,
})
