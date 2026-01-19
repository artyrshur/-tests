// tests/category.spec.ts — ПОЛНЫЙ ТЕСТ С КАЖДОЙ КАТЕГОРИЕЙ
import { test, expect } from '@playwright/test';
import { MobileMenuPage } from '../pages/mobile-menu.page';
import { CategoryPage } from '../pages/category.page';

const categoryTests = [
  { 
    name: 'Новинки', 
    menuText: 'Новинки', 
    title: 'Новинки',
    expectedProducts: 16,
    sortOption: 'popularity'
  },
  { 
    name: 'Парфюм', 
    menuText: 'Уход для лица',  // ← Текст из вашего оригинального массива
    title: 'Уход для лица',
    expectedProducts: 12,
    sortOption: 'price_asc'
  },
  { 
    name: 'Уход', 
    menuText: 'Уход для лица', 
    title: 'Уход',
    expectedProducts: 20,
    sortOption: 'rating'
  }
];

test.describe('Category Pages @mobile', () => {
  for (const testCase of categoryTests) {
    const { name, menuText, title, expectedProducts, sortOption } = testCase;

    test(`should display ${name} category correctly`, async ({ page }) => {
      
      //  НАВИГАЦИЯ ЧЕРЕЗ МОБИЛЬНОЕ МЕНЮ
      const menuPage = new MobileMenuPage(page);
      await menuPage.gotoHome();
      await menuPage.closeGeoPopupIfVisible();
      await menuPage.openMobileMenu();
      await menuPage.visualTestMenuOpen(); // 🎨 Меню одинаково для всех
      await menuPage.goToCategory(menuText);

      //  ПРОВЕРКА КАТЕГОРИИ
      const categoryPage = new CategoryPage(page);
      await categoryPage.waitForLoad();

      //  ФУНКЦИОНАЛЬНЫЕ ПРОВЕРКИ
      await expect(categoryPage.page.locator('h1')).toContainText(title);
      await categoryPage.verifyProducts(expectedProducts);

      //  ВИЗУАЛЬНАЯ ПРОВЕРКА (до сортировки)
      await categoryPage.visualTestGrid(name);

      //  ТЕСТ СОРТИРОВКИ
      await categoryPage.sortDropdown.selectOption(sortOption);
      await categoryPage.productGrid.waitFor({ state: 'visible' });
      
      // Проверяем: первый товар после сортировки
      const firstProduct = categoryPage.productCards.first();
      await expect(firstProduct).toBeVisible();
      
      // Кол-во товаров не изменилось (только порядок)
      await categoryPage.verifyProducts(expectedProducts);

      //  ВИЗУАЛ ПОСЛЕ СОРТИРОВКИ
      await categoryPage.visualTestGrid(`${name}-sorted`);

      // АРТЕФАКТЫ
      await categoryPage.screenshot(name);
    });
  }

  //  ДОПОЛНИТЕЛЬНЫЙ ТЕСТ: КЛИК ПО ТОВАРУ
  test('should open first product from category', async ({ page }) => {
    const menuPage = new MobileMenuPage(page);
    await menuPage.gotoHome();
    await menuPage.goToCategory('Новинки');

    const categoryPage = new CategoryPage(page);
    await categoryPage.clickProduct(0); // Первый товар

    // Проверка карточки товара
    await expect(page.locator('.product-detail, .goods-card-detail')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('.product-title')).toContainText(/название/i);
  });
});
