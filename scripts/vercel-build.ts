import { spawnSync } from "node:child_process"

function run(command: string, args: string[]) {
  const result = spawnSync(command, args, {
    env: process.env,
    stdio: "inherit",
  })
  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with status ${result.status}`)
  }
}

const target = process.env.VERCEL_ENV === "production" ? "production" : "preview"

if (process.env.PAYLOAD_MIGRATE_ON_DEPLOY === "true") {
  run("pnpm", ["payload:migrate"])
}

if (process.env.CONTENT_IMPORT_ON_DEPLOY === "true") {
  if (process.env.ALLOW_CMS_SEED !== "true") {
    throw new Error("CONTENT_IMPORT_ON_DEPLOY requires ALLOW_CMS_SEED=true.")
  }

  run("pnpm", [
    "cms:import",
    "--",
    `--target=${target}`,
    `--confirm=IMPORT_${target.toUpperCase()}`,
    ...(target === "production" ? ["--force"] : []),
  ])
}

run("pnpm", ["build"])
