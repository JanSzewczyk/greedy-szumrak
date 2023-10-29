import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL("/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Greedy Szumrak - Sign in/);
});

test("redirect to Google login page", async ({ page }) => {
  await page.goto("/");
  await page.goto("http://localhost:3000/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F");

  await expect(page.getByRole("heading", { name: "Greedy Szumrak" })).toBeVisible();
  await expect(page.getByText("by Szum-Tech")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Sign-in options" })).toBeVisible();

  await expect(
    page.getByRole("button", { name: "Sign in with Google Use your Google account to sign in." })
  ).toBeVisible();
});

test("login by Google", async ({ page }) => {
  await page.goto("/");
  await page.goto("http://localhost:3000/auth/signin?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F");

  await page.getByRole("button", { name: "Sign in with Google Use your Google account to sign in." }).click();

  await expect(page.getByText("Sign in", { exact: true })).toBeVisible();
  await expect(page.getByText("to continue to greedy-szumrak", { exact: true })).toBeVisible();

  await page.getByLabel("Email or phone").fill("sdfsdfasdfasdf@dsfsdf.sdf");
});
