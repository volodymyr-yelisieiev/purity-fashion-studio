import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join } from "node:path"

const sourceRoots = ["app", "components", "features", "lib"]
const issues: string[] = []

function listSourceFiles(root: string): string[] {
  if (!existsSync(root)) {
    return []
  }

  return readdirSync(root).flatMap((entry) => {
    const path = join(root, entry)
    const stat = statSync(path)

    return stat.isDirectory()
      ? listSourceFiles(path)
      : /\.(css|ts|tsx)$/.test(path)
        ? [path]
        : []
  })
}

const forbiddenImports = [
  ["lucide-react", "Use Phosphor icons from the active shadcn preset."],
  ["next-themes", "Theme state is owned by components/theme-provider.tsx."],
  [
    "components/ui/button-variants",
    "Use the canonical button contract from components/ui/button.tsx.",
  ],
] as const

for (const file of sourceRoots.flatMap(listSourceFiles)) {
  const source = readFileSync(file, "utf8")

  for (const [pattern, guidance] of forbiddenImports) {
    if (source.includes(pattern)) {
      issues.push(
        `${file}: forbidden architecture import ${pattern}. ${guidance}`
      )
    }
  }
}

if (existsSync("components/ui/button-variants.ts")) {
  issues.push(
    "components/ui/button-variants.ts must not return; components/ui/button.tsx is canonical."
  )
}

const componentsConfig = JSON.parse(
  readFileSync("components.json", "utf8")
) as {
  style?: string
  iconLibrary?: string
  tailwind?: { baseColor?: string }
}

if (
  componentsConfig.style !== "base-sera" ||
  componentsConfig.iconLibrary !== "phosphor" ||
  componentsConfig.tailwind?.baseColor !== "neutral"
) {
  issues.push(
    "components.json drifted from the Base Sera/neutral/Phosphor contract."
  )
}

const e2e = readFileSync("tests/e2e/purity.spec.ts", "utf8")
for (const required of [
  "[320, 375, 768, 1024, 1440, 1920]",
  '"uk", "ru", "en"',
  '"light", "dark"',
  "page.screenshot()",
  "scrollWidth",
]) {
  if (!e2e.includes(required)) {
    issues.push(
      `tests/e2e/purity.spec.ts is missing the required QA matrix contract: ${required}`
    )
  }
}

if (issues.length) {
  throw new Error(`Architecture QA failed:\n${issues.join("\n")}`)
}

console.log(
  "Architecture QA ok: Base UI, Phosphor, theme ownership, and responsive matrix contracts are intact"
)
