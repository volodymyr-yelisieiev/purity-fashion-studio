"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = Exclude<Theme, "system">

type ThemeContextValue = {
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

const emptySubscribe = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

function applyTheme(theme: ResolvedTheme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
  document.documentElement.style.colorScheme = theme
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") {
    return "system"
  }

  const storedTheme = localStorage.getItem("theme")
  return storedTheme === "light" || storedTheme === "dark"
    ? storedTheme
    : "system"
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>(getInitialTheme)
  const [systemTheme, setSystemTheme] = React.useState<ResolvedTheme>(() =>
    typeof window === "undefined" ? "light" : getSystemTheme()
  )
  const mounted = useHydrated()

  const resolvedTheme = theme === "system" ? systemTheme : theme

  const setTheme = React.useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme)
    localStorage.setItem("theme", nextTheme)
  }, [])

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const onSystemThemeChange = (event: MediaQueryListEvent) => {
      const nextSystemTheme = event.matches ? "dark" : "light"
      setSystemTheme(nextSystemTheme)
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key !== "theme") {
        return
      }

      const nextTheme: Theme =
        event.newValue === "light" || event.newValue === "dark"
          ? event.newValue
          : "system"
      setThemeState(nextTheme)
    }

    mediaQuery.addEventListener("change", onSystemThemeChange)
    window.addEventListener("storage", onStorage)

    return () => {
      mediaQuery.removeEventListener("change", onSystemThemeChange)
      window.removeEventListener("storage", onStorage)
    }
  }, [])

  React.useEffect(() => {
    if (mounted) {
      applyTheme(resolvedTheme)
    }
  }, [mounted, resolvedTheme])

  return (
    <ThemeContext.Provider value={{ resolvedTheme, setTheme }}>
      <ThemeHotkey />
      {children}
    </ThemeContext.Provider>
  )
}

function useHydrated() {
  return React.useSyncExternalStore(
    emptySubscribe,
    getClientSnapshot,
    getServerSnapshot
  )
}

function useTheme() {
  const context = React.useContext(ThemeContext)

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme()

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [resolvedTheme, setTheme])

  return null
}

function EnhancedContrastToggle({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  const { resolvedTheme, setTheme } = useTheme()
  const enabled = useHydrated() && resolvedTheme === "dark"

  return (
    <Button
      type="button"
      aria-pressed={enabled}
      onClick={() => setTheme(enabled ? "light" : "dark")}
      className={cn(
        "min-h-11",
        "aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-primary-foreground",
        className
      )}
      variant="outline"
      size="sm"
    >
      {label}
    </Button>
  )
}

export { EnhancedContrastToggle, ThemeProvider }
