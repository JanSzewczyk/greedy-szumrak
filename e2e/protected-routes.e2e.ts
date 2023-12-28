import { expect, test } from "@playwright/test";

test("protected base route", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL("/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F");
  await expect(page).toHaveTitle(/Greedy Szumrak - Sign in/);
});

test("protected introduction route ('/introduction')", async ({ page }) => {
  await page.goto("/introduction");
  await page.waitForURL("/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fintroduction");
  await expect(page).toHaveTitle(/Greedy Szumrak - Sign in/);
});

test("protected introduction sheet route ('/introduction/sheet')", async ({ page }) => {
  await page.goto("/introduction/sheet");
  await page.waitForURL("/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fintroduction%2Fsheet");
  await expect(page).toHaveTitle(/Greedy Szumrak - Sign in/);
});

test("protected sheet details route ('/sheets/<some-id>')", async ({ page }) => {
  await page.goto("/sheets/<some-id>");
  await page.waitForURL("/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2Fsheets%2F%253Csome-id%253E");
  await expect(page).toHaveTitle(/Greedy Szumrak - Sign in/);
});
