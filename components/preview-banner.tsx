import { draftMode } from "next/headers"

import { Button } from "@/components/ui/button"

const copy = {
  uk: "Увімкнено preview чернетки",
  ru: "Включён preview черновика",
  en: "Draft preview is enabled",
} as const

export async function PreviewBanner({ locale }: { locale: keyof typeof copy }) {
  const { isEnabled } = await draftMode()
  if (!isEnabled) return null

  return (
    <aside
      role="status"
      className="sticky top-0 z-50 flex items-center justify-between gap-4 border-b border-border bg-background px-4 py-2 text-sm text-foreground"
    >
      <span>{copy[locale]}</span>
      <form action="/api/exit-preview" method="post">
        <Button type="submit" size="sm" variant="outline">
          Exit preview
        </Button>
      </form>
    </aside>
  )
}
