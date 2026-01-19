import { Page, Locator, expect } from '@playwright/test';

/**
 * PageObject для десктопной страницы категории.
 * Методы отражают шаги из тестов: переход в категорию, проверка заголовка,
 * базовый визуальный снимок и сохранение скриншотов.
 */
export class CategoryPage {
    readonly page: Page;
    readonly title: Locator;
    readonly productGrid: Locator;
    readonly productCards: Locator;
    readonly filters: Locator;
    readonly sortDropdown: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('h1, [data-testid="category-title"]');
        this.productGrid = page.locator('.category-grid, [data-testid="products-grid"]');
        this.productCards = page.locator('.product-card, .goods-item');
        this.filters = page.locator('.filter-panel');
        this.sortDropdown = page.locator('[data-testid="sort"], select[name="sort"]');
    
    }

     /** Ожидание загрузки категории */
    async waitForLoad() {
        await this.productGrid.waitFor({ state: 'visible', timeout: 10000});

    }
    

    /** Проверка товаров на странице */
    async verifyProducts(count?: number) {
        await expect(this.productCards).toHaveCount(count || 12);

    }

    /** Визуальный тест сетки товаров */
    async visualTestGrid(name: string) {
        // Убираем динамические элементы (цены, таймеры, бейджи наличия), чтобы снизить флаки скриншотов
        await this.page
            .locator('.price-dynamic, .timer, .stock-badge')
            .evaluateAll((nodes) => nodes.forEach((n) => n.remove()));

        await expect(this.productGrid).toHaveScreenshot(
            `category-${name.toLowerCase()}-grid.png`,
            {
                maxDiffPixelRatio: 0.02,
                threshold: 0.2,
                // Если хотите ограничить область, можно вместо clip заюзать
                // отдельный локатор или обёртку над grid.
            }
        );
    }

    /** Визуальный тест блока товаров категории */
    async visualTestCategory(name: string) {
        await this.productGrid.waitFor({ state: 'visible' });
        await expect(this.productGrid).toHaveScreenshot(`category-${name.toLowerCase()}.png`, {
            maxDiffPixelRatio: 0.02,
            threshold: 0.2,
        });
    }

    /** Клик по конкретному товару */
  async clickProduct(index: number) {
    await this.productCards.nth(index).click();
    await this.page.waitForURL(/product\/|goods\//);
  }

  /** Выбор фильтра */
  async applyFilter(filterName: string) {
    const filter = this.filters.filter({ hasText: filterName });
    await expect(filter).toBeVisible();
    await filter.click();
    // Ждём, пока грид снова станет видимым (допустимые состояния: visible | attached | detached | hidden)
    await this.productGrid.waitFor({ state: 'visible' });
  }

  /** Скриншот всей категории */
  async screenshot(name: string) {
    await this.page.screenshot({
      path: `screenshots/category-${name.toLowerCase()}.png`,
      fullPage: true
    });
  }
}

