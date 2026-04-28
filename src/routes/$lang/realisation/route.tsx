import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/realisation')({
  component: Outlet,
})
