import { Page, Locator, expect } from '@playwright/test';

export class MobileMenuPage {
    readonly page: Page;
    readonly menuToggle: Locator;
    readonly categoryLinks: Locator;

    constructor(page: Page) {
        this.page = page;
        this.menuToggle = page.locator('[data-testid="mobile-menu-toggle"], .js-mobile-menu-toggle')
        this.categoryLinks = page.locator('.mobile-menu__nav-link')
    }

    async gotoHome() {
        await this.page.goto('https://n.dev-beauty.ru/');
        await this.page.waitForLoadState('networkidle');
    }
    async closeGeoPopupIfVisible() {
        const geoButton = this.page.locator('.js-confirm-city, [role="button"]:has-text("Да, верно")');
        if (await geoButton.isVisible({ timeout: 3000 })) {
            await geoButton.click();
        }
    }

    async openMobileMenu() {
        await this.menuToggle.first().click();
        await this.page.waitForSelector('.mobile-menu__nav-link', { state: 'visible' });
    }

    async goToCategory(categoryName: string) {
        const category = this.categoryLinks.filter({
            hasText: categoryName });
        await expect(category).toBeVisible();
        await category.click();
        await this.page.waitForURL(/\/catalog\/|\/category/);
    }

    /** Визуальный тест открытого мобильного меню */
    async visualTestMenuOpen() {
        const menu = this.page.locator('.mobile-menu');
        await menu.waitFor({ state: 'visible' });

        await expect(menu).toHaveScreenshot('mobile-menu-open.png', {
            maxDiffPixelRatio: 0.01,
            threshold: 0.3,
            mask: [
                this.page.locator('.promo-badge'),
                this.page.locator('.banner, .cookie, .timer, .price'),
            ],
            animations: 'disabled',
        });
    }

    /** Визуальный тест страницы категории */
    async visualTestCategory(name: string) {
        const grid = this.page.locator('.category-grid');
        await grid.waitFor({ state: 'visible' });

        await expect(grid).toHaveScreenshot(`category-${name.toLowerCase()}.png`, {
            maxDiffPixelRatio: 0.02,
            threshold: 0.2,
        });
    }

    async screenshot(name: string) {
        await this.page.screenshot({ path: `screenshots/mobile-${name.toLowerCase().replace(/\s+/g, '-')}.png`, fullPage: true });
    }
}