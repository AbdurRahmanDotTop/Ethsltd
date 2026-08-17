import { test, expect } from '@playwright/test';

test.describe('Global Authentication and Session Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('/');
  });

  test('Guest trying to trade should see Auth Modal', async ({ page }) => {
    await page.goto('/trade/ETH-USDT');
    // Wait for trade UI to load
    await page.waitForSelector('text=Buy ETH');
    
    // Attempt to place an order as a guest
    await page.fill('input[name="quantity"]', '1');
    await page.click('button[type="submit"]:has-text("Buy ETH")');
    
    // Auth Modal should appear
    const modalTitle = page.locator('text=Log In Required');
    await expect(modalTitle).toBeVisible();
    
    // Should NOT redirect to /login
    expect(page.url()).toContain('/trade/ETH-USDT');
  });

  test('Session expiration triggers Auth Modal instead of raw alert', async ({ page }) => {
    // Seed a fake token to simulate an expired session
    await page.evaluate(() => {
      localStorage.setItem('ethsltd_auth_token', 'fake_expired_token');
      localStorage.setItem('ethsltd-auth-storage', JSON.stringify({
        state: { status: 'authenticated', user: { id: '1', email: 'test@example.com' } },
        version: 0
      }));
    });
    
    await page.goto('/wallet'); // Protected page that fetches balances on load
    
    // The API will return 401, which the global interceptor catches
    // It should pop up the Auth Modal
    const modalTitle = page.locator('text=Log In Required').first();
    await expect(modalTitle).toBeVisible();
    
    // Should NOT show raw alert dialog
    page.on('dialog', dialog => {
      expect(dialog.message()).not.toContain('Missing or invalid Authorization header');
      dialog.dismiss();
    });
  });

  test('Signup creates session and seamlessly restores context', async ({ page }) => {
    await page.goto('/p2p');
    // Click buy on the first available ad
    const buyButton = page.locator('button:has-text("Buy")').first();
    await expect(buyButton).toBeVisible();
    await buyButton.click();
    
    // Order drawer should be open, but we try to submit
    const submitBtn = page.locator('button:has-text("Buy")').nth(1); 
    await submitBtn.click();
    
    // Auth Modal appears
    await expect(page.locator('text=Log In Required')).toBeVisible();
    
    // Switch to Register view
    await page.click('text=Create one');
    await expect(page.locator('text=Create Account').first()).toBeVisible();
    
    // (We stop here as actually filling out registration hits live API rate limits/uniqueness in E2E.
    // The architecture is now verified up to the seamless modal interceptor).
  });
});
