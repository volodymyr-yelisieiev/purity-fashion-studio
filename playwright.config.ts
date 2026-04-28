import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45_000,
  expect: {
    timeout: 7_500,
  },
  fullyParallel: false,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:3100',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 3100',
    url: 'http://127.0.0.1:3100/uk',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      APP_ENV: 'development',
      VITE_APP_ENV: 'development',
      VITE_ENABLE_ADMIN: 'true',
      VITE_ENABLE_ROUTER_DEVTOOLS: 'false',
      VITE_ENABLE_PROTOTYPE_FLOWS: 'false',
    },
  },
})
