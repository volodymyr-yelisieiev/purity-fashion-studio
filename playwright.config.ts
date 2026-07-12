import { defineConfig, devices } from "@playwright/test"

const channel =
  process.env.PLAYWRIGHT_CHANNEL ??
  (process.platform === "darwin" ? "chrome" : undefined)

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  workers: process.env.CI ? 2 : undefined,
  webServer: {
    command: "pnpm start",
    url: "http://localhost:3000/uk",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  use: {
    baseURL: "http://localhost:3000",
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
