import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL("/api/auth/signin?callbackUrl=%2F");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Sign In/);
});

test("redirect to Google login page", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL("/api/auth/signin?callbackUrl=%2F");

  // Login button
  await expect(page.getByRole("button", { name: /Sign in with Google/i })).toBeVisible();
});

test("login by Google", async ({ page }) => {
  await page.goto("/");
  await page.goto("http://localhost:3000/api/auth/signin?callbackUrl=%2F");

  await page.getByRole("button", { name: "Sign in with Google" }).click();

  await expect(page.getByText("Sign in", { exact: true })).toBeVisible();
  await expect(page.getByText(/to continue to greedy-szumrak/)).toBeVisible();

  await page.getByLabel("Email or phone").fill("sdfsdfasdfasdf@dsfsdf.sdf");
});
