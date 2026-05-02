import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/$lang/realisation/atelier')({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: '/$lang/realisation/$slug',
      params: { lang: params.lang, slug: 'atelier-service' },
      replace: true,
    })
  },
})
