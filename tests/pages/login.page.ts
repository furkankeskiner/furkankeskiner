import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.locator('[data-testid="login-email"], input[type="email"]').first();
    this.passwordInput = page.locator('[data-testid="login-password"], input[type="password"]').first();
    this.submitButton = page
      .locator('[data-testid="login-submit"], button[type="submit"]')
      .filter({ hasText: /giriş yap/i })
      .first();
  }

  async goto(): Promise<void> {
    await this.page.goto('/giris', { waitUntil: 'domcontentloaded' });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/giris(?:[/?#]|$)/);
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
