// A horizontal stepper is laid out by the flex shrink algorithm, which failed in
// two places at once when the rail was narrower than the steps: the connectors
// collapsed to nothing, then the steps refused to give and spilled over the
// props panel beside them.
//
// Rewritten in 1.0.0-beta.6, and again for the 2026-10 incoming sync: Stepper
// and Wizard now render incoming's markup — `stepper-item`s with a
// `stepper-indicator`, real `stepper-separator` elements for the connectors,
// and a rail that scrolls (overflow-x: auto) instead of shrinking the steps.
// The requirements are unchanged: nothing spills over the neighbour, the
// connectors stay drawn, and every step stays reachable.

import { expect, test } from "@playwright/test"

import { routePath, settle } from "./harness"

const STEPPER = '[data-slot="stepper"][data-orientation="horizontal"]'

// The workbench rail is the narrowest place a stepper renders on the docs site.
test.describe("horizontal stepper in a narrow rail", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 900 })
    await page.goto(routePath("/docs/stepper"))
    await settle(page)
  })

  test("steps that do not fit are contained, not painted over the neighbour", async ({
    page,
  }) => {
    const uncontained = await page.evaluate((STEPPER) => {
      return [...document.querySelectorAll(STEPPER)]
        .filter((s) => s.scrollWidth > s.clientWidth)
        .filter((s) => getComputedStyle(s).overflowX === "visible")
        .map((s) => `${s.scrollWidth} of content in ${s.clientWidth} of rail`)
    }, STEPPER)
    expect(uncontained).toEqual([])
  })

  test("connectors stay visible when the row is squeezed", async ({ page }) => {
    const connectors = await page.evaluate((STEPPER) => {
      return [...document.querySelectorAll(STEPPER)].flatMap((rail) =>
        [...rail.querySelectorAll('[data-slot="stepper-separator"]')].map(
          (sep) => {
            const style = getComputedStyle(sep)
            const box = sep.getBoundingClientRect()
            return {
              width: box.width,
              height: box.height,
              painted:
                style.backgroundColor !== "rgba(0, 0, 0, 0)" ||
                parseFloat(style.borderTopWidth) > 0,
            }
          }
        )
      )
    }, STEPPER)

    expect(connectors.length).toBeGreaterThan(0)
    expect(connectors.every((c) => c.painted)).toBe(true)
    expect(Math.min(...connectors.map((c) => c.width))).toBeGreaterThan(0)
    expect(Math.min(...connectors.map((c) => c.height))).toBeGreaterThan(0)
  })

  // Was "the rail is not a tab stop it has no content to justify": the 0.x
  // stylesheet shrank the row, so a stop led nowhere. Incoming's rail scrolls
  // instead, and a scrolling region has to be keyboard-reachable (axe
  // scrollable-region-focusable) — so the requirement turns around.
  test("a rail that scrolls is reachable by keyboard", async ({ page }) => {
    const rails = await page.evaluate(
      (STEPPER) =>
        [...document.querySelectorAll(STEPPER)].map((s) => ({
          scrolls:
            s.scrollWidth > s.clientWidth &&
            getComputedStyle(s).overflowX !== "visible",
          tabIndex: (s as HTMLElement).tabIndex,
        })),
      STEPPER
    )
    const scrolling = rails.filter((r) => r.scrolls)
    expect(scrolling.length, "the narrow rail makes one stepper scroll").toBeGreaterThan(0)
    expect(scrolling.every((r) => r.tabIndex >= 0)).toBe(true)
  })
})

// Was "Wizard still renders the stepper block it pins" (the 0.11
// `.ds-stepper__step` grammar): Wizard composes incoming's Stepper now. What
// stays pinned is that its steps render and the current one is told apart.
test.describe("Wizard renders its steps", () => {
  test("the wizard's steps render and the current one is distinguished", async ({
    page,
  }) => {
    await page.goto(routePath("/docs/wizard"))
    await settle(page)

    const wizard = page.locator('[data-slot="wizard"]').first()
    const steps = wizard.locator('[data-slot="stepper-item"]')
    await expect(steps.first()).toBeVisible()
    expect(await steps.count()).toBeGreaterThan(1)
    expect(await wizard.locator('[data-slot="stepper-indicator"]').count()).toBe(
      await steps.count()
    )

    const active = wizard.locator('[data-slot="stepper-item"][aria-current="step"]')
    await expect(active).toHaveCount(1)
    const marker = (loc: typeof active) =>
      loc
        .locator('[data-slot="stepper-indicator"]')
        .evaluate((el) => getComputedStyle(el).borderTopColor)
    const plain = wizard
      .locator('[data-slot="stepper-item"][data-state="inactive"]')
      .first()
    expect(await marker(active)).not.toBe(await marker(plain))
  })
})
