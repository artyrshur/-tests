// desktop.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Desktop Homepage @desktop', () => {
  test('should load homepage correctly', async ({ page }) => {
    await page.goto('https://n.dev-beauty.ru/');
    
    // Базовые проверки десктопной версии
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.desktop-header')).toBeVisible({ timeout: 5000 });
    
    // Скриншот
    await page.screenshot({ path: 'screenshots/desktop-homepage.png', fullPage: true });
  });
});
