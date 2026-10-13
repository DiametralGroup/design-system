import { expect, test } from "@playwright/test"

// Proof that the port renders like the original. Each baseline in
// tests/parity-baselines/ is a full-page screenshot of the same page in
// diamorval/diametral-ui-example, built on diametral-ds 0.4.0 from npm (the
// @diametral/ui this package absorbed). Taken on Linux Chromium, so compare on
// Linux. Do not regenerate them from this app: that would compare it with itself.
const PAGES = ["overview", "analytics", "clients", "projects", "planning", "inbox", "new-mission", "settings"]

for (const scheme of ["light", "dark"] as const) {
  test.describe(scheme, () => {
    test.use({ viewport: { width: 1440, height: 900 }, colorScheme: scheme, reducedMotion: "reduce" })

    for (const id of PAGES) {
      test(`${id} matches diametral-ds`, async ({ page }) => {
        await page.goto(`/${id}`, { waitUntil: "networkidle" })
        await page.getByRole("heading", { level: 1 }).first().waitFor()
        await page.addStyleTag({
          content: "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}",
        })
        await page.evaluate(() => document.fonts.ready)
        await page.waitForTimeout(400)
        // Sub-pixel text antialiasing differs: Geist's fallback list is longer here.
        await expect(page).toHaveScreenshot(`${id}-${scheme}.png`, { fullPage: true, maxDiffPixelRatio: 0.002 })
      })
    }
  })
}
