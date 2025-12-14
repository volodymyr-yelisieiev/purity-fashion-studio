/**
 * Loading state for locale pages
 * Shows a minimal skeleton while content loads
 */
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
}
