import { existsSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

const staticDir = ".next/static"
const maxStaticJsBytes = 2_000_000

function jsFiles(root: string): string[] {
  return readdirSync(root).flatMap((entry) => {
    const path = join(root, entry)
    const stat = statSync(path)

    if (stat.isDirectory()) {
      return jsFiles(path)
    }

    return path.endsWith(".js") ? [path] : []
  })
}

if (!existsSync(staticDir)) {
  throw new Error("Missing .next/static. Run pnpm build before qa:budget.")
}

const total = jsFiles(staticDir).reduce(
  (sum, path) => sum + statSync(path).size,
  0
)

if (total > maxStaticJsBytes) {
  throw new Error(
    `Static JS budget exceeded: ${total} bytes > ${maxStaticJsBytes} bytes`
  )
}

console.log(`Performance budget ok: ${total} static JS bytes`)
