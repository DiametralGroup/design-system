// Batch 2's own decisions, as opposed to Base UI's behaviour.
//
// Four of the fifteen absorbed components could not land as written.
// `theme-switcher` imported the source's held `dropdown-menu` and
// `toggle-group`; `snippet` imported the held `code-block`; `attachment`
// imported a `Button` that arrives in batch 7. Each was re-composed onto this
// repo's incumbent, so the first four blocks are what says the re-wiring is
// still in place and has not quietly reverted to a source symbol.
//
// The 2026-10 incoming sync reversed these re-wirings on purpose: incoming is
// the model, so its own composition is back (docs/absorption/direction.md).
// Where a test pinned a re-wiring, it now pins the same user-facing intent
// against incoming's markup; its comment says what it was.
//
// The rest guards work paid on the way in that nothing else would catch: the
// eight dedupe exceptions resolved into real declarations plus a modifier
// class, the two Tailwind plugin classes re-implemented as real CSS, and the
// charte's no-drop-shadow rule on the surfaces this batch lands.

import { expect, test } from "@playwright/test"

import { routePath, settle } from "./harness"

// The 2026-10 incoming sync reverses this re-wiring on purpose: ThemeSwitcher
// is incoming's again, composed on ToggleGroup and DropdownMenu rather than on
// the 0.x Segmented and .ds-menu. The four tests keep their user-facing intent.
test.describe("theme-switcher", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routePath("/docs/theme-switcher"))
    await settle(page)
  })

  test("the segmented variant is a labelled group of three toggles", async ({
    page,
  }) => {
    const group = page.locator('[data-slot="theme-switcher"][data-variant="segmented"]').first()
    await expect(group).toBeVisible()
    await expect(group).toHaveAttribute("role", "group")
    await expect(group).toHaveAttribute("aria-label", "Theme")
    expect(await group.locator('[data-slot="toggle-group-item"]').count()).toBe(3)
  })

  test("each segmented cell carries an accessible name, not an icon alone", async ({
    page,
  }) => {
    // Incoming's cells are icon-only, so the name has to come from aria-label.
    // Icon-only cells without it would be three unnamed buttons.
    const group = page.locator('[data-slot="theme-switcher"][data-variant="segmented"]').first()
    for (const name of ["Light", "Dark", "System"]) {
      await expect(group.getByRole("button", { name, exact: true })).toBeVisible()
    }
  })

  test("clicking a cell selects it and re-clicking it is a no-op", async ({
    page,
  }) => {
    const group = page.locator('[data-slot="theme-switcher"][data-variant="segmented"]').first()
    const dark = group.getByRole("button", { name: "Dark", exact: true })
    await dark.click()
    await expect(dark).toHaveAttribute("aria-pressed", "true")
    // A theme is never "none": the switcher swallows a click on the pressed cell.
    await dark.click()
    await expect(dark).toHaveAttribute("aria-pressed", "true")
  })

  test("the dropdown variant opens a painted menu of radio rows", async ({
    page,
  }) => {
    await page
      .locator('[data-slot="theme-switcher"][data-variant="dropdown"]')
      .first()
      .click()

    const popup = page.locator('[data-slot="dropdown-menu-content"]').first()
    await expect(popup).toBeVisible()
    await expect(popup).toHaveAttribute("role", "menu")
    expect(
      await popup.evaluate((el) => getComputedStyle(el).backgroundColor),
    ).not.toBe("rgba(0, 0, 0, 0)")
    const rows = popup.locator('[role="menuitemradio"]')
    expect(await rows.count()).toBe(3)
    await expect(rows.filter({ hasText: "Dark" })).toHaveCount(1)
  })
})

test.describe("snippet re-wired onto CodeBlock's extracted copy button", () => {
  test("the copy affordance is CodeBlockCopyButton, named and functional", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"])
    await page.goto(routePath("/docs/snippet"))
    await settle(page)

    const button = page.locator(".ds-snippet-copy-button").first()
    // Batch 13 (#46) swapped CodeBlock onto source's version: the copy
    // button is a plain <button> with its own class now, not a wrapped
    // .ds-button — .ds-code-block-copy-button carries its own full styling.
    await expect(button).toHaveClass(/ds-code-block-copy-button\b/)
    await expect(button).toHaveAttribute("aria-label", "Copy code")

    await button.click()
    // The idle name flips to "Copied" from the button's own state, which a
    // caller-supplied aria-label would have pinned shut.
    await expect(button).toHaveAttribute("aria-label", "Copied")
  })
})

test.describe("attachment actions", () => {
  // Was "re-wired onto IconButton" (`.ds-button--icon`): the 2026-10 incoming
  // sync renders incoming's Button at an icon size, with the name kept as a
  // DiametralGroup addition (`label`).
  test("every attachment action is a named icon button", async ({ page }) => {
    await page.goto(routePath("/docs/attachment"))
    await settle(page)

    const actions = page.locator('[data-slot="attachment-action"]')
    expect(await actions.count()).toBeGreaterThan(0)

    for (const action of await actions.all()) {
      // An unnamed icon-only control is the regression this catches.
      await expect(action).toHaveClass(/ds-button--size-icon/)
      const label = await action.getAttribute("aria-label")
      expect(label?.trim()).toBeTruthy()
    }
  })
})

test.describe("item lands with its Separator, not a forward import", () => {
  test("an item separator is a real .ds-separator with a resolved rule", async ({
    page,
  }) => {
    await page.goto(routePath("/docs/item"))
    await settle(page)

    const separator = page.locator('[data-slot="item-separator"]').first()
    await expect(separator).toBeVisible()
    await expect(separator).toHaveClass(/ds-separator\b/)

    // The source kept bg-border and the axis sizing as Tailwind literals so
    // tailwind-merge could dedupe them. Resolved into separator.css, so the
    // rule has to have a colour and a height of its own here.
    const painted = await separator.evaluate((el) => {
      const style = getComputedStyle(el)
      return { bg: style.backgroundColor, height: style.height }
    })
    expect(painted.bg).not.toBe("rgba(0, 0, 0, 0)")
    expect(parseFloat(painted.height)).toBeGreaterThan(0)
  })
})

test.describe("the resolved dedupe exceptions are real declarations", () => {
  // Each of these was a Tailwind literal kept in place upstream so
  // tailwind-merge could dedupe it against a consumer override. There is no
  // tailwind-merge here, so each has to be a real declaration — a zero value
  // means the literal was dropped rather than resolved.
  const GAPS = [
    { slug: "bubble", selector: ".ds-bubble-group", prop: "rowGap" },
    { slug: "toc", selector: ".ds-toc-list", prop: "rowGap" },
    {
      slug: "message-scroller",
      selector: ".ds-message-scroller-content",
      prop: "rowGap",
    },
  ]

  for (const { slug, selector, prop } of GAPS) {
    test(`${selector} owns its own gap`, async ({ page }) => {
      await page.goto(routePath(`/docs/${slug}`))
      await settle(page)

      const value = await page
        .locator(selector)
        .first()
        .evaluate(
          (el, key) =>
            getComputedStyle(el)[key as "rowGap"] as string,
          prop,
        )
      expect(parseFloat(value)).toBeGreaterThan(0)
    })
  }

  test(".ds-toc is sticky by default and .ds-toc--static opts out", async ({
    page,
  }) => {
    await page.goto(routePath("/docs/toc"))
    await settle(page)

    // Incoming keeps `sticky top-8` as a literal on Toc's own className, so a
    // Toc without an opt-out has to still be sticky. One demo overrides it
    // with the `static` utility; that one is not "without an opt-out".
    const plain = page
      .locator(".ds-toc:not(.ds-toc--static):not(.static)")
      .first()
    await expect(plain).toBeVisible()
    expect(await plain.evaluate((el) => getComputedStyle(el).position)).toBe(
      "sticky",
    )
    // The opt-out is a DiametralGroup addition and has to beat that literal.
    const opted = page.locator(".ds-toc.ds-toc--static").first()
    await expect(opted).toBeVisible()
    expect(await opted.evaluate((el) => getComputedStyle(el).position)).toBe(
      "static",
    )
  })

  test(".ds-resizable-panel-group fills its box by default", async ({
    page,
  }) => {
    await page.goto(routePath("/docs/resizable"))
    await settle(page)

    // `h-full w-full` were the literals every demo overrode. Baked as the
    // group's own defaults, so a group given a height fills it.
    const group = page.locator(".ds-resizable-panel-group").first()
    await expect(group).toBeVisible()
    const box = await group.boundingBox()
    expect(box?.height ?? 0).toBeGreaterThan(0)
  })
})

test.describe("the Tailwind-plugin classes are re-implemented, not dropped", () => {
  // The message-scroller demos are hand-written markup with no
  // `scroll-fade-b`, so its fade is checked below against the markup
  // incoming's MessageScrollerViewport renders.
  const MASKED = [
    {
      slug: "attachment",
      selector: ".ds-attachment-group",
      was: "scroll-fade-x",
    },
  ]

  for (const { slug, selector, was } of MASKED) {
    test(`${selector} fades where ${was} used to`, async ({ page }) => {
      await page.goto(routePath(`/docs/${slug}`))
      await settle(page)

      // Both came from shadcn's Tailwind plugin and were shipping as class
      // names with nothing behind them. A mask of "none" means the fade is
      // silently gone again.
      const mask = await page
        .locator(selector)
        .first()
        .evaluate((el) => {
          const style = getComputedStyle(el)
          return style.maskImage || style.webkitMaskImage
        })
      expect(mask).toContain("gradient")
    })
  }

  // Was `.ds-message-scroller-viewport fades where scroll-fade-b used to`,
  // read off the docs demos' hand-written viewport: the 2026-10 incoming sync
  // drops DiametralGroup's mask on the class, because incoming's binding puts
  // `scroll-fade-b` on the viewport itself. So the viewport that binding
  // renders is what has to fade.
  test(".ds-message-scroller-viewport fades at its bottom edge", async ({
    page,
  }) => {
    await page.goto(routePath("/docs/message-scroller"))
    await settle(page)

    const mask = await page.evaluate(() => {
      const host = document.createElement("div")
      host.innerHTML = `<div class="ds-message-scroller" style="height:120px"><div data-slot="message-scroller-viewport" class="ds-message-scroller-viewport scroll-fade-b"><div style="height:600px"></div></div></div>`
      document.body.appendChild(host)
      const style = getComputedStyle(host.querySelector(".ds-message-scroller-viewport")!)
      const value = style.maskImage || style.webkitMaskImage
      host.remove()
      return value
    })
    expect(mask).toContain("gradient")
  })
})

test.describe("charte conformance on the surfaces batch 2 lands", () => {
  const SLUGS = ["attachment", "bubble", "item", "snippet", "message"]

  for (const slug of SLUGS) {
    test(`${slug} paints no drop shadow`, async ({ page }) => {
      await page.goto(routePath(`/docs/${slug}`))
      await settle(page)

      // The system separates by 1px rule. Scoped to this component's own
      // classes so an incumbent elsewhere on the page cannot fail it, or hide
      // a regression by passing.
      // A drop shadow has an offset or a blur. A zero-offset, zero-blur spread
      // is a ring — incoming's bubble reactions cut themselves out of the
      // bubble with one in the surface colour — and is not a shadow.
      const shadowed = await page.evaluate((prefix) => {
        const els = Array.from(
          document.querySelectorAll(`[class*="ds-${prefix}"]`),
        )
        return els
          .map((el) => getComputedStyle(el).boxShadow)
          .filter((s) => s !== "none" && !s.includes("inset"))
          .filter((s) =>
            s
              .split(/,(?![^(]*\))/)
              .some((layer) => {
                const [x = 0, y = 0, blur = 0] = (
                  layer.replace(/(rgba?|oklch|oklab|color-mix|lab|lch|hsla?)\([^)]*\)/g, "").match(/-?[\d.]+px/g) ?? []
                ).map(parseFloat)
                return x !== 0 || y !== 0 || blur !== 0
              }),
          )
      }, slug)

      expect(shadowed).toEqual([])
    })
  }
})
