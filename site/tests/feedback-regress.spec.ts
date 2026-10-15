// Feedback — the integration contract, driven through the real docs routes.
//
// Three demos carry it: `feedback/inline` (the Scorecard shape: a required note,
// topics, a 500-character message, anonymous), `feedback/dialog` (the Ophélie
// shape: kind + title + message behind a header button) and `feedback/failing`
// (a French dialog whose send rejects). What is pinned here is behaviour a unit
// test of the core cannot see: validation shown only after the first attempt,
// aria-invalid on the right control, the draft thrown away on close, no close
// while a send is in flight, and the input kept when a send fails.

import AxeBuilder from "@axe-core/playwright"
import { expect, test, type Page } from "@playwright/test"

import { expectTheme, pinTheme, routePath, settle, type Theme } from "./harness"

const demo = (page: Page, key: string) =>
  page.locator(`[data-demo-key="${key}"]`)

async function open(page: Page, theme: Theme = "light") {
  await pinTheme(page, theme)
  await page.goto(routePath("/docs/feedback"))
  await settle(page)
  await expectTheme(page, theme)
}

// The a11y route gate sees the page at rest; the states below only exist after
// an interaction, so they are scanned here.
async function expectNoSeriousViolations(page: Page, include: string, label: string) {
  const { violations } = await new AxeBuilder({ page }).include(include).analyze()
  const blocking = violations
    .filter((v) => v.impact === "critical" || v.impact === "serious")
    .map((v) => `${v.id}: ${v.nodes[0]?.target?.join(" ")}`)
  expect(blocking, `axe on ${label}`).toEqual([])
}

const rating = (scope: ReturnType<typeof demo>) =>
  scope.getByRole("radiogroup", { name: /How was your experience/ })

for (const theme of ["light", "dark"] as const) {
  test.describe(`feedback inline form (${theme})`, () => {
    test.beforeEach(async ({ page }) => {
      await open(page, theme)
    })

    test("sending without the required note shows the error on the note only", async ({
      page,
    }) => {
      const form = demo(page, "feedback/inline")
      await expect(rating(form)).not.toHaveAttribute("aria-invalid", "true")
      await expect(form.getByRole("alert")).toHaveCount(0)

      await form.getByRole("button", { name: "Send", exact: true }).click()

      await expect(rating(form)).toHaveAttribute("aria-invalid", "true")
      const alert = form.getByRole("alert")
      await expect(alert).toHaveCount(1)
      await expect(alert).toHaveText("This field is required.")
      await expect(rating(form)).toHaveAttribute(
        "aria-describedby",
        (await alert.getAttribute("id")) ?? "missing"
      )
      // The optional message is not flagged.
      await expect(form.getByRole("textbox")).not.toHaveAttribute(
        "aria-invalid",
        "true"
      )
    })

    test("filling the note clears the error, sending succeeds, and 'Send another' resets", async ({
      page,
    }) => {
      const form = demo(page, "feedback/inline")
      await form.getByRole("button", { name: "Send", exact: true }).click()
      await expect(form.getByRole("alert")).toHaveCount(1)

      await form.getByRole("radio", { name: "4", exact: true }).click()
      await expect(form.getByText("Good", { exact: true })).toBeVisible()
      await expect(form.getByRole("alert")).toHaveCount(0)
      await expect(rating(form)).not.toHaveAttribute("aria-invalid", "true")

      await form.getByRole("checkbox", { name: "Performance" }).click()
      await form.getByRole("textbox").fill("  Fast, thanks.  ")
      await form.getByRole("button", { name: "Send", exact: true }).click()

      const status = form.getByRole("status").first()
      await expect(status).toContainText("Thank you")
      await expect(form.getByRole("textbox")).toHaveCount(0)
      await expect(form.locator("output")).toHaveText(
        "4/5 — performance"
      )
      // The success state stays: nothing closes it behind the user's back.
      await page.waitForTimeout(600)
      await expect(status).toBeVisible()

      await form.getByRole("button", { name: "Send another" }).click()
      await expect(form.getByRole("textbox")).toHaveValue("")
      await expect(form.getByRole("radio", { checked: true })).toHaveCount(0)
      await expect(form.getByRole("checkbox", { name: "Performance" })).not.toBeChecked()
      // A fresh form does not start with errors showing.
      await expect(form.getByRole("alert")).toHaveCount(0)
    })

    test("no serious axe violation with the errors showing", async ({ page }) => {
      const form = demo(page, "feedback/inline")
      await form.getByRole("button", { name: "Send", exact: true }).click()
      await expect(form.getByRole("alert")).toHaveCount(1)
      await expectNoSeriousViolations(
        page,
        '[data-demo-key="feedback/inline"]',
        `inline form with errors [${theme}]`
      )
    })

    test("the message counter stops at 500", async ({ page }) => {
      const form = demo(page, "feedback/inline")
      const message = form.getByRole("textbox")
      await expect(form.getByText("0/500")).toBeVisible()

      await message.fill("x".repeat(600))
      await expect(message).toHaveValue("x".repeat(500))
      await expect(form.getByText("500/500")).toBeVisible()
    })

    test("the anonymous box is part of the payload", async ({ page }) => {
      const form = demo(page, "feedback/inline")
      await form.getByRole("radio", { name: "2", exact: true }).click()
      await form.getByRole("checkbox", { name: /Send anonymously/ }).click()
      await form.getByRole("button", { name: "Send", exact: true }).click()
      await expect(form.locator("output")).toHaveText(
        "2/5 — no topic — anonymous"
      )
    })
  })
}

test.describe("feedback dialog", () => {
  test.beforeEach(async ({ page }) => {
    await open(page)
  })

  test("the header button opens it; Escape closes it and throws the draft away", async ({
    page,
  }) => {
    const trigger = demo(page, "feedback/dialog").getByRole("button", {
      name: "Report",
    })
    await trigger.click()
    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole("heading", { name: "Send feedback" })).toBeVisible()

    await dialog.getByRole("button", { name: "Bug" }).click()
    await dialog.getByRole("textbox", { name: /Title/ }).fill("Export fails")
    await dialog.getByRole("textbox", { name: /Message/ }).fill("It never ends.")

    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()

    await trigger.click()
    const reopened = page.getByRole("dialog")
    await expect(reopened).toBeVisible()
    await expect(reopened.getByRole("textbox", { name: /Title/ })).toHaveValue("")
    await expect(reopened.getByRole("textbox", { name: /Message/ })).toHaveValue("")
    await expect(reopened.getByRole("button", { name: "Bug", pressed: true })).toHaveCount(0)
    await expect(reopened.getByRole("alert")).toHaveCount(0)
  })

  test("no serious axe violation with the dialog open and its errors showing", async ({
    page,
  }) => {
    await demo(page, "feedback/dialog")
      .getByRole("button", { name: "Report" })
      .click()
    const dialog = page.getByRole("dialog")
    await dialog.getByRole("button", { name: "Send", exact: true }).click()
    await expect(dialog.getByRole("alert")).toHaveCount(3)
    await expectNoSeriousViolations(page, '[role="dialog"]', "feedback dialog with errors")
  })

  test("the three required fields are flagged, then a valid send succeeds and stays open", async ({
    page,
  }) => {
    await demo(page, "feedback/dialog")
      .getByRole("button", { name: "Report" })
      .click()
    const dialog = page.getByRole("dialog")

    await dialog.getByRole("button", { name: "Send", exact: true }).click()
    await expect(dialog.getByRole("alert")).toHaveCount(3)
    await expect(dialog.getByRole("textbox", { name: /Title/ })).toHaveAttribute(
      "aria-invalid",
      "true"
    )
    await expect(dialog.getByRole("textbox", { name: /Message/ })).toHaveAttribute(
      "aria-invalid",
      "true"
    )

    await dialog.getByRole("button", { name: "Feature" }).click()
    await dialog.getByRole("textbox", { name: /Title/ }).fill("Dark charts")
    await dialog.getByRole("textbox", { name: /Message/ }).fill("Please.")
    await expect(dialog.getByRole("alert")).toHaveCount(0)
    await dialog.getByRole("button", { name: "Send", exact: true }).click()

    await expect(dialog.getByRole("status")).toContainText("Thank you")
    await page.waitForTimeout(600)
    await expect(dialog).toBeVisible()
    await expect(
      demo(page, "feedback/dialog").locator("output")
    ).toContainText("Sent: feature — Dark charts (from /design-system/docs/feedback)")
  })
})

test.describe("feedback dialog whose send fails", () => {
  test.beforeEach(async ({ page }) => {
    await open(page)
  })

  test("the error is shown, the input is kept, and nothing closes while it is in flight", async ({
    page,
  }) => {
    await demo(page, "feedback/failing")
      .getByRole("button", { name: "Signaler" })
      .click()
    const dialog = page.getByRole("dialog")
    await expect(dialog.getByRole("heading", { name: "Envoyer un retour" })).toBeVisible()
    await expect(dialog.getByRole("button", { name: "Bug", pressed: true })).toBeVisible()

    const message = dialog.getByRole("textbox", { name: /Message/ })
    await message.fill("Rien ne se passe.")
    await dialog.getByRole("button", { name: "Envoyer", exact: true }).click()

    // In flight: the button says so, and Escape does not close the dialog.
    await expect(dialog.getByRole("button", { name: "Envoi en cours…" })).toBeDisabled()
    await page.keyboard.press("Escape")
    await expect(dialog).toBeVisible()

    const alert = dialog.getByRole("alert")
    await expect(alert).toContainText("Le serveur ne répond pas. Réessayez dans un instant.")
    await expect(message).toHaveValue("Rien ne se passe.")
    await expect(dialog.getByRole("button", { name: "Envoyer", exact: true })).toBeEnabled()

    // The user can fix and retry, or leave: Escape now closes.
    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()
  })
})
