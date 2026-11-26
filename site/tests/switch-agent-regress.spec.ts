// Switch is the pilot for UI SDK (ADR 0004). It must keep the keyboard, focus
// and ARIA contract the Base UI switch had, and it must now be visible to the
// agent bridge: readable through snapshot(), changeable through act(), with
// the bridge's allow() able to refuse a step. The "Operated by an agent"
// example drives the real createAgent() bridge from its buttons.

import { expect, test } from "@playwright/test"

import { routePath, settle } from "./harness"

test.beforeEach(async ({ page }) => {
  await page.goto(routePath("/docs/switch"))
  await settle(page)
})

test.describe("switch keyboard, focus and ARIA", () => {
  test("is a named role=switch whose aria-checked follows its state", async ({
    page,
  }) => {
    const autosave = page.getByRole("switch", { name: "Autosave", exact: true })
    await expect(autosave).toHaveAttribute("aria-checked", "false")
    await expect(autosave).toHaveAttribute("data-unchecked", "")

    await autosave.click()
    await expect(autosave).toHaveAttribute("aria-checked", "true")
    await expect(autosave).toHaveAttribute("data-checked", "")
    await expect(
      autosave.locator('[data-slot="switch-thumb"]')
    ).toHaveAttribute("data-checked", "")
  })

  // UI SDK's switch follows the native checkbox: Enter submits a form and
  // never toggles (its switch.md, Keyboard).
  test("Space toggles it, Enter does not", async ({ page }) => {
    const autosave = page.getByRole("switch", { name: "Autosave", exact: true })
    await autosave.focus()

    await page.keyboard.press("Space")
    await expect(autosave).toHaveAttribute("aria-checked", "true")
    await page.keyboard.press("Space")
    await expect(autosave).toHaveAttribute("aria-checked", "false")
    await page.keyboard.press("Enter")
    await expect(autosave).toHaveAttribute("aria-checked", "false")
  })

  test("Tab moves switch to switch, skipping the hidden form input", async ({
    page,
  }) => {
    await page.getByRole("switch", { name: "Autosave", exact: true }).focus()
    await page.keyboard.press("Tab")
    await expect(
      page.getByRole("switch", { name: "Speaker notes", exact: true })
    ).toBeFocused()
  })

  test("keyboard focus draws the focus ring", async ({ page }) => {
    await page.getByRole("switch", { name: "Autosave", exact: true }).focus()
    await page.keyboard.press("Tab")
    const notes = page.getByRole("switch", { name: "Speaker notes", exact: true })
    await expect(notes).toBeFocused()
    const shadow = await notes.evaluate((el) => getComputedStyle(el).boxShadow)
    expect(shadow).not.toBe("none")
  })

  test("a disabled switch is out of the tab order and does not toggle", async ({
    page,
  }) => {
    const disabled = page.getByRole("switch", { name: "Disabled", exact: true })
    await expect(disabled).toBeDisabled()
    await disabled.click({ force: true })
    await expect(disabled).toHaveAttribute("aria-checked", "false")
  })
})

test.describe("switch through the agent bridge", () => {
  test("snapshot reads every switch by its label, state and action", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Read the page" }).click()
    const snapshot = JSON.parse(
      (await page.getByLabel("Agent snapshot").textContent()) ?? "[]"
    )

    expect(snapshot).toEqual([
      { label: "Autosave", checked: false, actions: ["setChecked"] },
      { label: "Speaker notes", checked: true, actions: ["setChecked"] },
      { label: "Share publicly", checked: false, actions: ["setChecked"] },
    ])
  })

  test("act changes the switch and the app sees the agent as the source", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Agent: toggle Autosave" }).click()

    await expect(
      page.getByRole("switch", { name: "Autosave", exact: true })
    ).toHaveAttribute("aria-checked", "true")
    await expect(page.getByText("Autosave turned on by the agent")).toBeVisible()
    await expect(page.getByRole("status").filter({ hasText: "Done" })).toBeVisible()
  })

  test("a person's change is reported as theirs, not the agent's", async ({
    page,
  }) => {
    await page.getByRole("switch", { name: "Autosave", exact: true }).click()
    await expect(page.getByText("Autosave turned on by you")).toBeVisible()
  })

  test("allow() refuses the step: the switch stays put and the refusal shows", async ({
    page,
  }) => {
    await page
      .getByRole("button", { name: "Agent: toggle Share publicly" })
      .click()

    const refused = page.getByRole("status").filter({ hasText: "Refused" })
    await expect(refused).toBeVisible()
    await expect(refused).toContainText("Share publicly stays as it was")
    await expect(
      page.getByRole("switch", { name: "Share publicly", exact: true })
    ).toHaveAttribute("aria-checked", "false")
    await expect(page.getByText("No change yet.")).toBeVisible()
  })
})
