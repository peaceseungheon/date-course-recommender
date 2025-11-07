import { test, expect } from "@playwright/test";

test("search page shows recommendations", async ({ page }) => {
  await page.goto("http://localhost:3000/search");
  await page.waitForSelector("ul");
  const items = await page.$$eval("ul li", (els) => els.length);
  expect(items).toBeGreaterThanOrEqual(1);
});
