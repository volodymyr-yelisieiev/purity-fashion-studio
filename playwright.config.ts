import { defineConfig, devices } from '@playwright/test'

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3100'
const webServerCommand =
  process.env.PLAYWRIGHT_WEB_SERVER_COMMAND ?? 'npm run dev -- --host 127.0.0.1 --port 3100'
const webServerURL = process.env.PLAYWRIGHT_WEB_SERVER_URL ?? `${baseURL}/uk`
const playwrightAppEnv = process.env.PLAYWRIGHT_APP_ENV ?? 'development'
const enableAdmin = process.env.PLAYWRIGHT_ENABLE_ADMIN ?? (playwrightAppEnv === 'production' ? 'false' : 'true')

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45_000,
  expect: {
    timeout: 7_500,
  },
  fullyParallel: false,
  reporter: [['list']],
  use: {
    baseURL,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: webServerCommand,
    url: webServerURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      APP_ENV: playwrightAppEnv,
      VITE_APP_ENV: playwrightAppEnv,
      VITE_ENABLE_ADMIN: enableAdmin,
      VITE_ENABLE_ROUTER_DEVTOOLS: 'false',
      VITE_ENABLE_PROTOTYPE_FLOWS: 'false',
      ADMIN_USERNAME: 'admin',
      ADMIN_PASSWORD: 'purity-local-admin',
      ADMIN_SESSION_SECRET: 'purity-playwright-admin-session-secret',
    },
  },
})
