// Batch 3's own decisions, as opposed to Base UI's behaviour.
//
// Three of the fifteen absorbed components replace a symbol this package
// already exported — `button-group`, `icon-button` and `wordmark` — and four
// more compose onto an incumbent because the source component they wanted
// arrives in batch 7: `editable`, `field-array`, `phone-input` and, in its one
// demo, `carousel`. The first blocks are what says those re-wirings are still
// in place and have not quietly reverted to a source symbol.
//
// The 2026-10 incoming sync reversed these re-wirings on purpose: incoming is
// the model, so its own composition is back (docs/absorption/direction.md).
// Where a test pinned a re-wiring, it now pins the same user-facing intent
// against incoming's markup; its comment says what it was.
//
// The rest guards work paid on the way in that nothing else would catch: six
// resolved dedupe exceptions, `carousel`/`input-otp`'s real bindings (batch
// 16, #49 — stylesheet-only until then), the `.ds-label` namespace merge, and
// the theme and escape-hatch defects.

import { expect, test } from "@playwright/test"
import { routePath, settle } from "./harness"

/* -- The replaced appliers ------------------------------------------------- */

test.describe("button-group replaces the applier", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routePath("/docs/button-group"))
    await settle(page)
  })

  test("the group is a role=group carrying data-orientation", async ({
    page,
  }) => {
    const group = page.locator('[data-slot="button-group"]').first()
    await expect(group).toBeVisible()
    await expect(group).toHaveAttribute("role", "group")
    // The seam is keyed to this attribute, so a group without it is a plain row.
    await expect(group).toHaveAttribute("data-orientation", "horizontal")
  })

  test("the shared edge removes a border rather than overlapping members", async ({
    page,
  }) => {
    // The incumbent used margin-left: -1px. Its replacement zeroes the losing
    // border with a logical property, which is what makes the seam RTL-correct;
    // a negative margin here would mean the old rules came back.
    const second = page
      .locator('[data-slot="button-group"] > .ds-button')
      .nth(1)
    await expect(second).toBeVisible()
    const box = await second.evaluate((el) => {
      const s = getComputedStyle(el)
      return { start: s.borderInlineStartWidth, margin: s.marginLeft }
    })
    expect(box.start).toBe("0px")
    expect(box.margin).toBe("0px")
  })

  // Was "the separator composes .ds-separator--auto, not a Tailwind literal":
  // the 2026-10 incoming sync keeps incoming's `data-vertical:h-auto` literals
  // on purpose, so the modifier and the no-literal checks are gone. The rule's
  // geometry is the user-facing part and stays.
  test("the separator is a 1px rule exactly as tall as its neighbours", async ({
    page,
  }) => {
    const sep = page.locator('[data-slot="button-group-separator"]').first()
    await expect(sep).toBeVisible()
    await expect(sep).toHaveAttribute("role", "separator")
    const [rule, button] = await Promise.all([
      sep.boundingBox(),
      sep.locator("xpath=..").locator(".ds-button").first().boundingBox(),
    ])
    expect(rule?.width).toBeCloseTo(1, 0)
    expect(rule?.height).toBeCloseTo(button!.height, 0)
    expect(
      await sep.evaluate((el) => getComputedStyle(el).backgroundColor),
    ).not.toBe("rgba(0, 0, 0, 0)")
  })

  test("the text cell is not a control", async ({ page }) => {
    const text = page.locator('[data-slot="button-group-text"]').first()
    if ((await text.count()) === 0) test.skip()
    await expect(text).toBeVisible()
    // No tab stop: it names its neighbour, it is not a thing to activate.
    expect(await text.evaluate((el) => el.tabIndex)).toBeLessThan(0)
  })

  test("the split action's menu is DropdownMenu's own surface", async ({
    page,
  }) => {
    // Batch 13 (#46) swapped Dropdown -> DropdownMenu for real: the held
    // .ds-menu vocabulary this test used to guard against a premature import
    // is what the incumbent rendered before the swap landed. Now the menu
    // really is DropdownMenu's, with its own .ds-dropdown-menu-* classes.
    await page
      .locator('[aria-label="Other deploy targets"]')
      .first()
      .click()
    await expect(
      page.locator(".ds-dropdown-menu-content").first()
    ).toBeVisible()
  })
})

test.describe("icon-button replaces the applier", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routePath("/docs/icon-button"))
    await settle(page)
  })

  test("every icon button carries an accessible name", async ({ page }) => {
    // The whole point of the component, on both sides of the absorption:
    // `label` is required in the type and lands on aria-label and title.
    const buttons = page.locator('[data-slot="icon-button"]')
    const count = await buttons.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i++) {
      const b = buttons.nth(i)
      const label = await b.getAttribute("aria-label")
      expect(label, `icon button ${i} has no aria-label`).toBeTruthy()
      await expect(b).toHaveAttribute("title", label!)
    }
  })

  // Was "the source's icon- size spellings resolve onto the square boxes" and
  // "icon-xs is a real 24px square" (0.x `.ds-button--icon` + `--sm`/`--xs`):
  // the 2026-10 incoming sync renders incoming's `ds-button--size-icon-*`
  // sizes, and IconButton's DiametralGroup addition maps the bare 0.x sizes
  // onto them. What a user gets is still a square box per size.
  test("every icon button is a square on one of the icon sizes", async ({
    page,
  }) => {
    const boxes = await page
      .locator('[data-slot="icon-button"]')
      .evaluateAll((els) =>
        els.map((el) => ({
          size: /ds-button--size-(icon(?:-xs|-sm|-lg)?)\b/.exec(el.className)?.[1],
          width: el.getBoundingClientRect().width,
          height: el.getBoundingClientRect().height,
        })),
      )
    expect(boxes.length).toBeGreaterThan(0)
    for (const box of boxes) {
      expect(box.size, "an icon button off the icon size axis").toBeTruthy()
      expect(box.width).toBeGreaterThan(0)
      expect(box.width).toBeCloseTo(box.height, 0)
    }
  })

  test("the icon sizes step up from xs to lg", async ({ page }) => {
    const widthOf = async (size: string) =>
      (await page
        .locator(`[data-slot="icon-button"].ds-button--size-${size}`)
        .first()
        .boundingBox())!.width
    const [xs, sm, md, lg] = await Promise.all(
      ["icon-xs", "icon-sm", "icon", "icon-lg"].map(widthOf),
    )
    expect(xs).toBeLessThan(sm)
    expect(sm).toBeLessThan(md)
    expect(md).toBeLessThan(lg)
  })
})

test.describe("wordmark replaces the placeholder mark", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routePath("/docs/wordmark"))
    await settle(page)
  })

  test("the real lockup renders, not the circle-square-line placeholder", async ({
    page,
  }) => {
    const mark = page.locator('[data-slot="wordmark"]').first()
    await expect(mark).toBeVisible()
    // The placeholder was a <circle>, a <rect> and a <line>. The real lockups
    // are paths, on one of two viewBoxes.
    const svg = mark.locator("svg").first()
    expect(await svg.locator("circle, rect, line").count()).toBe(0)
    expect(await svg.locator("path").count()).toBeGreaterThan(0)
    expect(await svg.getAttribute("viewBox")).toMatch(
      /^0 0 (2751 519|1770 1769)$/,
    )
  })

  test("the paths are currentColor so ink recolours the mark", async ({
    page,
  }) => {
    const fill = await page
      .locator('[data-slot="wordmark"] svg path[fill]')
      .first()
      .getAttribute("fill")
    expect(fill).toBe("currentColor")
  })

  test("svg sizing is a real declaration keyed to data-variant", async ({
    page,
  }) => {
    // The dedupe exception this file owed: the source kept `[&_svg]:h-5` and
    // `[&_svg]:size-8` literal on its cva. A zero-height svg here would mean
    // the literal was carried across and now styles nothing.
    for (const variant of ["horizontal", "square"] as const) {
      const svg = page
        .locator(`[data-slot="wordmark"][data-variant="${variant}"] svg`)
        .first()
      if ((await svg.count()) === 0) continue
      const box = await svg.boundingBox()
      expect(box?.height, `${variant} svg has no height`).toBeGreaterThan(8)
    }
  })

  test("a mark beside its own name is decorative", async ({ page }) => {
    // Announcing "Diametral" twice is worse than not announcing it. Both
    // label="" and a `name` beside the mark drop the svg out of the tree.
    const beside = page
      .locator('[data-slot="wordmark"]')
      .filter({ has: page.locator(".ds-wordmark__name") })
      .first()
    if ((await beside.count()) === 0) test.skip()
    await expect(beside.locator("svg").first()).toHaveAttribute(
      "aria-hidden",
      "true",
    )
  })
})

/* -- The forward re-wirings ------------------------------------------------ */

test.describe("editable's pencil", () => {
  // Was "the pencil is an IconButton with a required name" (data-slot
  // "icon-button"): the 2026-10 incoming sync renders incoming's ghost Button
  // at size icon-xs. The name is what a user needs, and it is still there.
  test("the pencil is a named icon button", async ({ page }) => {
    await page.goto(routePath("/docs/editable"))
    await settle(page)
    const pencil = page
      .locator('[data-slot="editable"]')
      .first()
      .getByRole("button", { name: "Edit", exact: true })
    await expect(pencil).toBeVisible()
    await expect(pencil).toHaveClass(/ds-button--size-icon/)
  })

  test("the pencil is reachable by keyboard despite opacity 0", async ({
    page,
  }) => {
    await page.goto(routePath("/docs/editable"))
    await settle(page)
    // .ds-editable-edit-button is invisible until hover; :focus-visible is what
    // keeps it usable, so losing that rule would hide a working control.
    const pencil = page.locator('[data-slot="editable"] [aria-label="Edit"]').first()
    await pencil.focus()
    await expect(pencil).toHaveCSS("opacity", "1")
  })

  test("Escape restores the committed value rather than the draft", async ({
    page,
  }) => {
    await page.goto(routePath("/docs/editable"))
    await settle(page)
    const root = page.locator('[data-slot="editable"]').first()
    const before = (await root.locator('[data-slot="editable-preview"]').innerText()).trim()
    await root.locator('[aria-label="Edit"]').click()
    const input = root.locator('[data-slot="editable-input"]')
    await input.fill("something else")
    await input.press("Escape")
    await expect(root.locator('[data-slot="editable-preview"]')).toHaveText(before)
  })
})

test.describe("field-array composes onto the incumbents", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routePath("/docs/field-array"))
    await settle(page)
  })

  test("remove is an IconButton naming its own entry", async ({ page }) => {
    const removes = page.locator('[data-slot="field-array-remove"]')
    const count = await removes.count()
    expect(count).toBeGreaterThan(1)
    const names = new Set<string>()
    for (let i = 0; i < count; i++) {
      const label = await removes.nth(i).getAttribute("aria-label")
      expect(label).toBeTruthy()
      names.add(label!)
    }
    // A stack of buttons all reading "Remove" tells a screen reader nothing.
    expect(names.size).toBe(count)
  })

  test("the item is a centred row and its content can shrink", async ({
    page,
  }) => {
    // The source kept `flex items-center` on the item and `flex` on the content
    // literal so tailwind-merge could dedupe them. They are the class's own
    // defaults here, and no literal crossed over.
    const item = page.locator('[data-slot="field-array-item"]').first()
    await expect(item).toHaveCSS("display", "flex")
    await expect(item).toHaveCSS("align-items", "center")
    // (The "no `items-center` literal" check is gone: the 2026-10 incoming
    // sync keeps incoming's literals on purpose. The computed layout is what
    // matters, and it is asserted above and below.)

    const content = page
      .locator('[data-slot="field-array-item-content"]')
      .first()
    await expect(content).toHaveCSS("display", "flex")
    // min-width: 0 is load-bearing — without it a long value pushes the remove
    // button out of the block.
    await expect(content).toHaveCSS("min-width", "0px")
  })

  test("removing an entry keeps the values below it put", async ({ page }) => {
    // The keys come off a stable entry id, not the index. Keyed by index,
    // removing the first row makes React reuse the wrong node and the values
    // below it shift up by one — which is what this catches. Scoped to the
    // basic demo: the playground's remove button carries no handler.
    const demo = page.locator('[data-slot="field-array"]').filter({
      has: page.locator('input[name="diplomas[0].title"]'),
    })
    const titles = demo.locator('[data-slot="field-array-item"] input[name$=".title"]')
    const second = (await titles.nth(1).inputValue()).trim()
    expect(second).toBeTruthy()
    await demo.locator('[data-slot="field-array-remove"]').first().click()
    await expect(titles).toHaveCount(1)
    await expect(titles.first()).toHaveValue(second)
  })
})

// Was "phone-input composes onto the native Select": the 2026-10 incoming
// sync renders incoming's PhoneInput, whose country picker is incoming's
// Select (a combobox over a listbox) rather than a native <select>. These keep
// the intent — both halves named, one underline, the dial code switchable
// without losing the number — against that markup.
test.describe("phone-input", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routePath("/docs/phone-input"))
    await settle(page)
  })

  test("the country picker is a named combobox that opens a list of countries", async ({
    page,
  }) => {
    const root = page.locator('[data-slot="phone-input"]').first()
    const country = root.locator('[data-slot="phone-input-country"]')
    await expect(country).toBeVisible()
    await expect(country).toHaveAttribute("role", "combobox")
    await expect(country).toHaveAttribute("aria-label", "Country calling code")
    await country.click()
    await expect(page.getByRole("listbox")).toBeVisible()
    expect(await page.getByRole("option").count()).toBeGreaterThan(1)
  })

  test("both halves are named and neither draws its own border", async ({
    page,
  }) => {
    // The group draws the single underline and the members draw none.
    const root = page.locator('[data-slot="phone-input"]').first()
    const country = root.locator('[data-slot="phone-input-country"]')
    const number = root.locator('[data-slot="phone-input-number"]')
    await expect(country).toHaveAttribute("aria-label", "Country calling code")
    await expect(number).toHaveAttribute("aria-label", "Phone number")
    for (const part of [country, number]) {
      const widths = await part.evaluate((el) => {
        const s = getComputedStyle(el)
        return [s.borderTopWidth, s.borderRightWidth, s.borderBottomWidth, s.borderLeftWidth]
      })
      expect(widths.every((w) => w === "0px")).toBe(true)
    }
    await expect(root).toHaveCSS("border-bottom-width", "1px")
  })

  test("changing the country rewrites the dial code and keeps the number", async ({
    page,
  }) => {
    const root = page.locator('[data-slot="phone-input"]').first()
    const number = root.locator('[data-slot="phone-input-number"]')
    const country = root.locator('[data-slot="phone-input-country"]')
    await number.fill("612345678")
    await country.click()
    await page.getByRole("option", { name: /\(\+32\)/ }).click()
    await expect(number).toHaveValue("612345678")
    await expect(country).toContainText("+32")
    // Base UI's hidden input carries the form value.
    await expect(root.locator('input[aria-hidden="true"]')).toHaveValue("BE")
  })
})

/* -- carousel and input-otp, real bindings since batch 16 (#49) ------------ */

test.describe("carousel's real binding", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routePath("/docs/carousel"))
    await settle(page)
  })

  test("the page prints a real import line", async ({ page }) => {
    // The reverse of the old stylesheet-only assertion: exports is no longer
    // [], so the page promises real Carousel* symbols now.
    await expect(page.locator("main").last()).toContainText("import { Carousel")
  })

  test("the gutter is the track's negative margin against the item's padding", async ({
    page,
  }) => {
    // Not a `gap`: a gap on the track would double the spacing, and there would
    // be room before the first slide.
    const track = page.locator(".ds-carousel-content").first()
    await expect(track).toHaveCSS("display", "flex")
    await expect(track).toHaveCSS("margin-left", "-16px")
    await expect(track).toHaveCSS("column-gap", "normal")
    await expect(page.locator(".ds-carousel-item").first()).toHaveCSS(
      "padding-left",
      "16px",
    )
  })

  test("--third is a real basis, not a literal basis-1/3", async ({
    page,
  }) => {
    const item = page.locator(".ds-carousel-item--third").first()
    await expect(item).toBeVisible()
    await expect(item).toHaveCSS("flex-basis", "33.3333%")
    expect(await item.getAttribute("class")).not.toMatch(/basis-\d/)
  })

  test("the controls are IconButtons outside the viewport", async ({
    page,
  }) => {
    // IconButton's required `label` is the accessible name — the source hid it
    // in an sr-only span, which this package has no utility class for.
    for (const name of ["Previous slide", "Next slide"]) {
      const control = page.getByRole("button", { name }).first()
      await expect(control).toHaveClass(/ds-carousel-control/)
      await expect(control).toHaveCSS("position", "absolute")
    }
  })
})

test.describe("input-otp's real binding", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routePath("/docs/input-otp"))
    await settle(page)
  })

  test("the page prints a real import line", async ({ page }) => {
    await expect(page.locator("main").last()).toContainText("import { InputOTP")
  })

  test("one real input carries the value, the slots only display it", async ({
    page,
  }) => {
    const root = page.locator(".ds-input-otp").first()
    await expect(root).toBeVisible()
    expect(await root.locator("input").count()).toBe(1)
    expect(await root.locator(".ds-input-otp-slot").count()).toBe(6)
    // The slots are a plain div each — no value, no onChange — the input
    // beneath announces the value on its own, so nothing here needs aria-hidden
    // (unlike the pre-batch-16 stylesheet-only stub they replace).
  })

  test("data-active tracks real focus, not a static demo state", async ({
    page,
  }) => {
    const root = page.locator(".ds-input-otp").first()
    const slots = root.locator(".ds-input-otp-slot")
    // Nothing is focused on load — every slot starts inactive.
    await expect(slots.first()).toHaveAttribute("data-active", "false")
    await root.locator("input").click()
    // Focusing the real input activates its first slot.
    await expect(slots.first()).toHaveAttribute("data-active", "true")
    await expect(slots.nth(1)).toHaveAttribute("data-active", "false")
  })
})

/* -- Work paid on the way in ---------------------------------------------- */

// Was "the .ds-label namespace merge": the 2026-10 incoming sync makes
// `.ds-label` incoming's Label (CHANGELOG, "Base typography") — 0.x's small
// caps in typography.css are gone, and dimming is keyed to Tailwind's `peer`
// and `group` markers as in incoming. The row and the dimming stay.
test.describe("label", () => {
  test("a label is a row, so an aside can sit beside the words", async ({
    page,
  }) => {
    await page.goto(routePath("/docs/label"))
    await settle(page)
    const label = page.locator(".ds-label").first()
    await expect(label).toBeVisible()
    await expect(label).toHaveCSS("display", "flex")
    await expect(label).toHaveCSS("align-items", "center")
  })

  test("a label after a disabled peer control dims", async ({ page }) => {
    await page.goto(routePath("/docs/label"))
    await settle(page)
    const dimmed = page.locator(".peer:disabled ~ .ds-label").first()
    await expect(dimmed).toBeVisible()
    await expect(dimmed).toHaveCSS("opacity", "0.5")
  })

  test("a label inside a disabled group dims too", async ({ page }) => {
    await page.goto(routePath("/docs/label"))
    await settle(page)
    const dimmed = page.locator('.group[data-disabled="true"] .ds-label').first()
    await expect(dimmed).toBeVisible()
    await expect(dimmed).toHaveCSS("opacity", "0.5")
  })
})

test.describe("toggle's charte edits", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routePath("/docs/toggle"))
    await settle(page)
  })

  test("aria-pressed carries the state, not a modifier class", async ({
    page,
  }) => {
    const pressed = page.locator('[data-slot="toggle"][aria-pressed="true"]').first()
    const rest = page.locator('[data-slot="toggle"][aria-pressed="false"]').first()
    await expect(pressed).toBeVisible()
    const [on, off] = await Promise.all([
      pressed.evaluate((el) => getComputedStyle(el).backgroundColor),
      rest.evaluate((el) => getComputedStyle(el).backgroundColor),
    ])
    expect(on).not.toBe(off)
  })

  // Was "focus is a 2px outline, not a colour ring in box-shadow" (a charte
  // edit): the 2026-10 incoming sync restores incoming's 3px focus ring. What
  // has to hold is that keyboard focus is visible at all.
  test("keyboard focus draws a visible ring", async ({ page }) => {
    const toggle = page.locator('[data-slot="toggle"]').first()
    const rest = await toggle.evaluate((el) => getComputedStyle(el).boxShadow)
    await page.keyboard.press("Tab")
    await toggle.focus()
    const focused = await toggle.evaluate((el) => {
      const s = getComputedStyle(el)
      return {
        visible: el.matches(":focus-visible"),
        outline: parseFloat(s.outlineWidth),
        shadow: s.boxShadow,
      }
    })
    expect(focused.visible).toBe(true)
    expect(focused.outline > 0 || (focused.shadow !== "none" && focused.shadow !== rest)).toBe(true)
  })

  test("the icon sizing has no Tailwind escape hatch left", async ({
    page,
  }) => {
    // `svg:not([class*="size-"])` silently skipped any icon whose class merely
    // contained `size-`. The rule is unconditional now, so every glyph sizes.
    const svg = page.locator('[data-slot="toggle"] svg').first()
    if ((await svg.count()) === 0) test.skip()
    const box = await svg.boundingBox()
    expect(box?.width).toBeCloseTo(14, 0)
  })
})

test.describe("meter reads a fill token, not a text token", () => {
  test("a toned indicator paints a real colour", async ({ page }) => {
    // The source's six tone keys read the --ds-*-ink family — the text shade,
    // and only four of the six exist here. They read --ds-*-solid, the family
    // tuned for fills, so an unset custom property would leave the bar
    // --ds-accent and this comparison would fail.
    await page.goto(routePath("/docs/meter"))
    await settle(page)
    const toned = page.locator('[class*="ds-meter--tone-"]').first()
    if ((await toned.count()) === 0) test.skip()
    const indicator = toned.locator(".ds-meter-indicator").first()
    const plain = page
      .locator('[data-slot="meter"]:not([class*="ds-meter--tone-"]) .ds-meter-indicator')
      .first()
    if ((await plain.count()) === 0) test.skip()
    const [a, b] = await Promise.all([
      indicator.evaluate((el) => getComputedStyle(el).backgroundColor),
      plain.evaluate((el) => getComputedStyle(el).backgroundColor),
    ])
    expect(a).not.toBe(b)
    expect(a).not.toBe("rgba(0, 0, 0, 0)")
  })

  test("the value row is tabular so it does not jitter", async ({ page }) => {
    await page.goto(routePath("/docs/meter"))
    await settle(page)
    await expect(page.locator(".ds-meter-value").first()).toHaveCSS(
      "font-variant-numeric",
      "tabular-nums",
    )
  })
})

test.describe("relative-time's parsing contract", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(routePath("/docs/relative-time"))
    await settle(page)
  })

  test("a SQL timestamp with microseconds parses like the Date does", async ({
    page,
  }) => {
    // The reason the component normalises rather than handing the string to
    // Date: engines disagree on a space separator and on microseconds. Every
    // parseable row on the page describes the same instant, so they must agree.
    // Scoped to the demo that lists every shape of one instant; the other
    // demos on the page carry their own dates.
    const texts = await page
      .locator("dl [data-slot='relative-time']:not([data-invalid])")
      .allInnerTexts()
    const parseable = texts.map((t) => t.trim()).filter(Boolean)
    expect(parseable.length).toBeGreaterThan(3)
    expect(new Set(parseable).size).toBe(1)
  })

  test("an unparseable value renders as it arrived instead of crashing", async ({
    page,
  }) => {
    const bad = page.locator("[data-slot='relative-time'][data-invalid]").first()
    await expect(bad).toBeVisible()
    await expect(bad).toHaveText("last tuesday-ish")
    // No dateTime, because there is no date — and no thrown toISOString().
    expect(await bad.getAttribute("datetime")).toBeNull()
  })

  test("every valid instance carries the exact time in its title", async ({
    page,
  }) => {
    const ok = page.locator("[data-slot='relative-time']:not([data-invalid])")
    const count = await ok.count()
    for (let i = 0; i < count; i++) {
      expect(await ok.nth(i).getAttribute("title")).toBeTruthy()
      expect(await ok.nth(i).getAttribute("datetime")).toBeTruthy()
    }
  })
})
