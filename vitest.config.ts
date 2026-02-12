import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@payload-config": path.resolve(__dirname, "./payload.config.ts"),
      "next/navigation": path.resolve(
        __dirname,
        "./node_modules/next/navigation.js",
      ),
      "next/headers": path.resolve(__dirname, "./node_modules/next/headers.js"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    environmentMatchGlobs: [
      ["components/**/*.test.tsx", "jsdom"],
      ["hooks/**/*.test.tsx", "jsdom"],
      ["**/MethodologyContext.test.tsx", "jsdom"],
    ],
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/__tests__/**/*.test.{ts,tsx}", "**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", "e2e"],
    server: {
      deps: {
        inline: ["next-intl"],
      },
    },
    coverage: {
      provider: "v8",
      include: [
        "lib/**/*.ts",
        "lib/**/*.tsx",
        "hooks/**/*.ts",
        "hooks/**/*.tsx",
        "config/**/*.ts",
        "components/**/*.tsx",
        "app/api/**/*.ts",
      ],
      exclude: [
        "**/__tests__/**",
        "**/node_modules/**",
        "**/*.d.ts",
        "lib/logger.ts",
        "lib/payload.ts",
      ],
    },
  },
} as any);
