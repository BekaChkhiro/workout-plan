import { expect, test } from "@playwright/test";

test("home page renders headline", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Fit Plan")).toBeVisible();
});
