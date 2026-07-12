import { existsSync, readFileSync } from "node:fs"

const globals = readFileSync("app/globals.css", "utf8")
const requiredThemeTokens = [
  "--background",
  "--foreground",
  "--card",
  "--card-foreground",
  "--popover",
  "--popover-foreground",
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--muted",
  "--muted-foreground",
  "--accent",
  "--accent-foreground",
  "--destructive",
  "--border",
  "--input",
  "--ring",
]
const missingThemeTokens = requiredThemeTokens.filter(
  (token) => !globals.includes(token)
)
const forbiddenPurityTokens =
  /--(?:color-)?purity-(?:ink|graphite|stone|line|paper|ivory|silk|taupe|burgundy|gold-muted)\b/

if (
  missingThemeTokens.length ||
  forbiddenPurityTokens.test(globals) ||
  !globals.includes(".dark {") ||
  !globals.includes("@media (prefers-reduced-motion: reduce)")
) {
  throw new Error(
    `Invalid semantic theme contract: ${missingThemeTokens.join(", ") || "custom PURITY tokens or missing dark/reduced-motion rules"}`
  )
}

const components = JSON.parse(readFileSync("components.json", "utf8")) as {
  style?: string
  iconLibrary?: string
  tailwind?: { baseColor?: string }
}

if (
  components.style !== "base-sera" ||
  components.iconLibrary !== "phosphor" ||
  components.tailwind?.baseColor !== "neutral"
) {
  throw new Error(
    "components.json must preserve the b59jufTOPg Base Sera/neutral/Phosphor baseline"
  )
}

for (const path of [
  "components/purity.tsx",
  "app/[locale]/styleguide/page.tsx",
  "public/brand/logo-purity.png",
]) {
  if (!existsSync(path)) {
    throw new Error(`Missing UI system artifact: ${path}`)
  }
}

console.log(
  `Design tokens ok: ${requiredThemeTokens.length} semantic preset tokens`
)
