import { defineConfig } from "@playwright/test"

// PARITY_BASE_URL points the suite at another server — CI sets it to the
// original diametral-ui-example to (re)generate tests/parity-baselines/ on the
// same runner that then checks this app against them.
const external = process.env.PARITY_BASE_URL

export default defineConfig({
  testDir: "tests",
  snapshotPathTemplate: "{testDir}/parity-baselines/{arg}{ext}",
  use: { baseURL: external ?? "http://localhost:4173" },
  webServer: external
    ? undefined
    : {
        command: "npm run build && npm run preview -- --port 4173 --strictPort",
        url: "http://localhost:4173",
        reuseExistingServer: !process.env.CI,
      },
})
