import { defineConfig, devices } from "@playwright/test"

if (
  process.env.NO_COLOR !== undefined &&
  process.env.FORCE_COLOR === undefined
) {
  delete process.env.NO_COLOR
  process.env.FORCE_COLOR = "0"
}

const channel =
  process.env.PLAYWRIGHT_CHANNEL ??
  (process.platform === "darwin" ? "chrome" : undefined)
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000"
const usesRemoteBaseURL = process.env.PLAYWRIGHT_BASE_URL !== undefined

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  workers: process.env.CI ? 2 : undefined,
  ...(usesRemoteBaseURL
    ? {}
    : {
        webServer: {
          command: "pnpm start",
          url: `${baseURL}/uk`,
          reuseExistingServer: !process.env.CI,
          timeout: 60_000,
        },
      }),
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  snapshotPathTemplate:
    "{testDir}/__screenshots__/{testFilePath}/{platform}/{arg}{ext}",
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...(channel ? { channel } : {}),
      },
    },
  ],
})
