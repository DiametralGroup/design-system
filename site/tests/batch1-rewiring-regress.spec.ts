// Batch 1's own decisions, as opposed to Base UI's behaviour.
//
// Three of the six absorbed components could not land as written: `menubar`
// imported the source's held `dropdown-menu`, and `speed-dial` and
// `autocomplete` imported a `Button` and an `InputGroup` that arrive in batch 7.
// Each was re-composed onto this repo's incumbent, and batch 7 re-wires them
// back — so these assertions are what says the re-wiring is still in place and
// has not quietly reverted to a source symbol or a Tailwind literal.
//
// The 2026-10 incoming sync reversed these re-wirings on purpose: incoming is
// the model, so its own composition is back (docs/absorption/direction.md).
// Where a test pinned a re-wiring, it now pins the same user-facing intent
// against incoming's markup; its comment says what it was.
//
// The last block guards the charte fix applied on the way in: the source's
// popups carried drop shadows, and this system separates by rule.

import { expect, test } from "@playwright/test"

import { routePath, settle } from "./harness"

test.describe("menubar composes DropdownMenu", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routePath("/docs/menubar"))
    await settle(page)
  })

  // Was "an open menu is a .ds-menu whose rows are .ds-menu__item": the
  // 2026-10 incoming sync composes Menubar on incoming's DropdownMenu, so the
  // popup is DropdownMenu's own surface rather than the 0.x .ds-menu grammar.
  // What a user needs is unchanged: a painted menu whose rows are menu items.
  test("an open menu is a painted DropdownMenu surface of menu items", async ({
    page,
  }) => {
    await page.locator(".ds-menubar-trigger").first().click()

    const popup = page.locator('[data-slot="menubar-content"]').first()
    await expect(popup).toBeVisible()
    await expect(popup).toHaveAttribute("role", "menu")
    await expect(popup).toHaveClass(/ds-dropdown-menu-content\b/)
    // An unstyled popup is a transparent one.
    expect(
      await popup.evaluate((el) => getComputedStyle(el).backgroundColor),
    ).not.toBe("rgba(0, 0, 0, 0)")
    const item = popup.locator('[data-slot="menubar-item"]').first()
    await expect(item).toHaveAttribute("role", "menuitem")
    await expect(item).toHaveClass(/ds-dropdown-menu-item\b/)
  })

  test("the bar is one tab stop and arrow keys travel between menus", async ({
    page,
  }) => {
    const triggers = page.locator(".ds-menubar-trigger")
    expect(await triggers.count()).toBeGreaterThan(1)

    await triggers.first().focus()
    await page.keyboard.press("ArrowRight")

    // Base UI's menubar root is what hands focus across; without it each menu
    // would be an isolated dropdown with a tab stop of its own.
    await expect(triggers.nth(1)).toBeFocused()
  })
})

test.describe("speed-dial's trigger", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routePath("/docs/speed-dial"))
    await settle(page)
  })

  // Was "re-wired onto IconButton" (`.ds-button--icon` + `.ds-speed-dial`):
  // the 2026-10 incoming sync renders incoming's Button at size icon-lg.
  test("the trigger is a square icon button carrying its accessible name", async ({
    page,
  }) => {
    const trigger = page.locator('[data-slot="speed-dial"]').first()
    await expect(trigger).toHaveClass(/\bds-button\b/)
    await expect(trigger).toHaveClass(/ds-button--size-icon/)
    const box = await trigger.boundingBox()
    expect(box!.width).toBeGreaterThan(0)
    expect(box!.width).toBeCloseTo(box!.height, 0)
    // `label` reaches the trigger's aria-label; a dial with no visible text and
    // no name is unreachable by anything but a pointer.
    expect(await trigger.getAttribute("aria-label")).toBeTruthy()
  })

  // Was "the docked demos position by class, not by a Tailwind literal"
  // (`.ds-speed-dial--docked`): incoming docks with `absolute end-4 bottom-4`
  // literals on purpose. The intent kept is the docking itself.
  test("a docked dial sits inside its region, not fixed to the viewport", async ({
    page,
  }) => {
    const docked = await page
      .locator('[data-slot="speed-dial"]')
      .evaluateAll((els) =>
        els.map((el) => ({
          position: getComputedStyle(el).position,
          parent: getComputedStyle(el.parentElement!).position,
        })),
      )
    expect(docked.length).toBeGreaterThan(0)
    expect(docked.filter((d) => d.position === "absolute").length).toBeGreaterThan(0)
    // Absolute against a positioned region, so it docks to that region.
    for (const d of docked.filter((d) => d.position === "absolute")) {
      expect(d.parent).not.toBe("static")
    }
  })

  test("opening swaps the glyph and closes on Escape", async ({ page }) => {
    const trigger = page.locator('[data-slot="speed-dial"]').first()
    const closeGlyph = trigger.locator(".ds-speed-dial-icon-close")

    await expect(closeGlyph).toBeHidden()
    await trigger.click()
    await expect(page.locator(".ds-speed-dial-actions").first()).toBeVisible()
    // The swap is CSS off aria-expanded, so it is the one part of the dial a
    // non-React binding still gets.
    await expect(closeGlyph).toBeVisible()

    await page.keyboard.press("Escape")
    await expect(page.locator(".ds-speed-dial-actions")).toHaveCount(0)
    await expect(trigger).toBeFocused()
  })
})

test.describe("autocomplete composes InputGroup", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routePath("/docs/autocomplete"))
    await settle(page)
  })

  test("the field is a .ds-input-group around a .ds-input", async ({ page }) => {
    const group = page.locator(".ds-input-group").first()
    await expect(group).toBeVisible()
    await expect(group.locator("input.ds-input").first()).toBeVisible()
  })

  // Was "the clear button is a button in the group's addon slot", keyed to
  // the 0.x `.ds-input-group__addon` and `.ds-button--icon`: incoming's
  // InputGroup renders `data-slot="input-group-addon"` and its Button sizes
  // as `ds-button--size-icon-*`. The behaviour is the same.
  test("the clear button is a named button in the group's addon slot", async ({
    page,
  }) => {
    // Scoped to one group: the playground's field has no `showClear` and so
    // no addon at all.
    const group = page
      .locator('[data-slot="input-group"]')
      .filter({ has: page.locator('[data-slot="input-group-addon"]') })
      .first()
    const input = group.locator('[data-slot="input-group-control"]')
    const clear = group.locator(
      '[data-slot="input-group-addon"] button[data-slot="autocomplete-clear"]',
    )

    // Base UI unmounts Clear while there is nothing to clear.
    await expect(clear).toHaveCount(0)

    await input.fill("co")
    await expect(clear).toBeVisible()
    // Incoming's InputGroupButton carries its size as data-size; icon-xs is
    // a square, icon-only button, so the aria-label is its whole name.
    await expect(clear).toHaveAttribute("data-size", "icon-xs")
    const box = await clear.boundingBox()
    expect(box!.width).toBeCloseTo(box!.height, 0)
    await expect(clear).toHaveAttribute("aria-label", "Clear")

    await clear.click()
    expect(await input.inputValue()).toBe("")
  })

  test("typing filters the list and picking an item writes it back", async ({
    page,
  }) => {
    const input = page.locator("input.ds-input").first()
    await input.click()
    await input.fill("co")

    const item = page.locator(".ds-autocomplete-item").first()
    await expect(item).toBeVisible()
    const text = (await item.textContent())?.trim()
    await item.click()
    expect(await input.inputValue()).toBe(text)
  })
})

test.describe("charte conformance on the absorbed popups", () => {
  const SLUGS = ["context-menu", "autocomplete", "hover-card", "navigation-menu"]

  for (const slug of SLUGS) {
    test(`${slug} paints no drop shadow`, async ({ page }) => {
      await page.goto(routePath(`/docs/${slug}`))
      await settle(page)

      // The system separates by 1px rule. The source's popups arrived with a
      // 10%-ink ring plus two shadow layers; they land as bordered surfaces.
      // Scoped to this component's own classes so an incumbent elsewhere on the
      // page cannot fail it, or hide a regression by passing.
      const shadowed = await page.evaluate((prefix) => {
        const els = Array.from(
          document.querySelectorAll(`[class*="ds-${prefix}"]`),
        )
        return els
          .map((el) => getComputedStyle(el).boxShadow)
          .filter((s) => s !== "none" && !s.includes("inset"))
      }, slug)

      expect(shadowed).toEqual([])
    })
  }
})
