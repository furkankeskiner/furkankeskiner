import { expect, test } from '@playwright/test';
import { LoginPage } from './pages/login.page';

test.describe('Trendyol giriş', () => {
  test('giriş formunu gösterir', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.expectLoaded();
    await expect(loginPage.emailInput).toBeEditable();
    await expect(loginPage.passwordInput).toBeEditable();
  });

  test('geçerli test hesabıyla giriş yapar', async ({ page }) => {
    const email = process.env.TRENDYOL_EMAIL;
    const password = process.env.TRENDYOL_PASSWORD;
    test.skip(!email || !password, 'TRENDYOL_EMAIL ve TRENDYOL_PASSWORD tanımlanmalı');

    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.expectLoaded();
    await loginPage.login(email!, password!);

    await expect(page).not.toHaveURL(/\/giris(?:[/?#]|$)/, { timeout: 20_000 });
    await expect(page.getByText(/hesabım/i).first()).toBeVisible();
  });
});
