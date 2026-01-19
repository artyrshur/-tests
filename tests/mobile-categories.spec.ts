// mobile-categories.spec.ts
import { test, expect } from '@playwright/test';
import { MobileMenuPage } from '../pages/mobile-menu.page';

const categories = [
  { name: 'Новинки', locatorText: 'Новинки' },
  { name: 'Парфюм', locatorText: 'Парфюм' },
];

test.describe('Mobile Menu Navigation @mobile', () => {
  for (const category of categories) {
    test(`should navigate to ${category.name} category`, async ({ page }, testInfo) => {
      const mobilePage = new MobileMenuPage(page);

      await mobilePage.gotoHome();
      await mobilePage.closeGeoPopupIfVisible();
      await mobilePage.openMobileMenu();
      await mobilePage.visualTestMenuOpen();
      await mobilePage.goToCategory(category.locatorText);

      await expect(page).toHaveURL(/\/catalog\/|\/category/);
      await expect(page.locator('h1, [data-testid="category-title"]')).toBeVisible();

      await mobilePage.visualTestCategory(category.locatorText);
      await mobilePage.screenshot(category.name);
    });
  }
});
