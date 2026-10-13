import { expect, test } from "@playwright/test"

const PAGES = ["overview", "analytics", "clients", "projects", "planning", "inbox", "new-mission", "settings"]

for (const id of PAGES) {
  test(`${id} renders without errors`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (error) => errors.push(error.message))
    page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()))

    await page.goto(`/${id}`)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    expect(errors).toEqual([])
  })
}

test("the package stylesheet applies: flat, 1px, no radius", async ({ page }) => {
  await page.goto("/")
  const button = page.getByRole("button", { name: /search/i })
  await expect(button).toHaveCSS("border-radius", "0px")
  await expect(button).toHaveCSS("border-top-width", "1px")
})

test("dark mode toggles the .dark class", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" })
  await page.goto("/")
  await expect(page.locator("html")).toHaveClass(/dark/)
})

test("command palette navigates", async ({ page }) => {
  await page.goto("/")
  await page.keyboard.press("ControlOrMeta+k")
  await page.getByPlaceholder("Jump to a page…").fill("settings")
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/\/settings$/)
})

test("deep links load and unknown paths redirect", async ({ page }) => {
  await page.goto("/projects")
  await expect(page.getByRole("heading", { level: 1, name: "Projects" })).toBeVisible()
  await page.goto("/nope")
  await expect(page).toHaveURL(/\/overview$/)
})

test("sidebar links navigate without a reload", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await page.goto("/overview")
  await page.getByRole("link", { name: "Analytics" }).first().click()
  await expect(page.getByRole("heading", { level: 1, name: "Analytics" })).toBeVisible()
  expect(errors).toEqual([])
})
