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

run("pnpm", ["content:manifest:verify"])

if (process.env.PAYLOAD_RESET_ON_DEPLOY === "true") {
  if (target !== "preview" || process.env.VERCEL_ENV !== "preview") {
    throw new Error("PAYLOAD_RESET_ON_DEPLOY is allowed only for Vercel Preview.")
  }
  if (process.env.ALLOW_CMS_RESET !== "true") {
    throw new Error("PAYLOAD_RESET_ON_DEPLOY requires ALLOW_CMS_RESET=true.")
  }

  run("pnpm", ["payload", "migrate:fresh", "--force-accept-warning"])
  run("pnpm", [
    "blob:reset-preview",
    "--",
    "--target=preview",
    "--confirm=RESET_PREVIEW",
  ])
}

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
    ...(process.env.PAYLOAD_RESET_ON_DEPLOY === "true"
      ? ["--refresh-media"]
      : []),
    ...(target === "production" ? ["--force"] : []),
  ])
}

run("pnpm", ["build"])
