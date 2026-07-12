import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"

import { buildCmsSeed, validateCmsSeed } from "../content/cms"

const seed = buildCmsSeed()
const result = validateCmsSeed(seed)

if (!result.ok) {
  throw new Error(
    `Cannot export invalid CMS seed:\n${result.issues.join("\n")}`
  )
}

const outputIndex = process.argv.indexOf("--out")
const outputPath =
  outputIndex >= 0 ? process.argv[outputIndex + 1] : "tmp/purity-cms-seed.json"
const json = `${JSON.stringify(seed, null, 2)}\n`

if (process.argv.includes("--stdout")) {
  process.stdout.write(json)
} else {
  const absoluteOutputPath = resolve(outputPath)

  mkdirSync(dirname(absoluteOutputPath), { recursive: true })
  writeFileSync(absoluteOutputPath, json)
  console.log(`Wrote CMS seed to ${absoluteOutputPath}`)
}
