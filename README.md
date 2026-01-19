# Проект тестирования Playwright

Проект автоматизированного тестирования веб-приложения с использованием Playwright.

## Структура проекта

```
.
├── config.ts              # Конфигурация Playwright
├── pages/                 # Page Object Model страниц
│   ├── category.page.ts
│   ├── home.page.ts
│   └── mobile-menu.page.ts
├── tests/                 # Тестовые файлы
│   ├── desktop.spec.ts
│   └── mobile-categories.spec.ts
└── test-results/          # Результаты тестов
    ├── html-report/
    └── traces/
```

## Установка зависимостей

```bash
npm install
```

## Запуск тестов

### Запуск всех тестов
```bash
npx playwright test
```

### Запуск тестов для десктопной версии
```bash
npx playwright test --project=chromium-desktop
```

### Запуск тестов для мобильной версии
```bash
npx playwright test --project=chromium-mobile
```

### Запуск в UI режиме
```bash
npx playwright test --ui
```

### Запуск в режиме отладки
```bash
npx playwright test --debug
```

## Просмотр отчета

После запуска тестов отчет доступен по адресу:
```bash
npx playwright show-report
```

## Конфигурация

Базовый URL тестируемого приложения: `https://n.dev-beauty.ru/`

Проект настроен на:
- Автоматические скриншоты при ошибках
- Видео записи при ошибках
- Трассировку при первой повторной попытке
- HTML и JSON отчеты

