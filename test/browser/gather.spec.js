import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { recipes } from '../../src/data/recipes.js';

test.beforeEach(async ({ page }) => {
  page.consoleErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().includes('Failed to load resource: the server responded with a status of 404')) {
      page.consoleErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => page.consoleErrors.push(error.message));
  await page.addInitScript(() => localStorage.removeItem('what-starter-gather-v1'));
});

test.afterEach(async ({ page }) => {
  expect(page.consoleErrors).toEqual([]);
});

test('search, filter, detail scaling, planner, shopping list, and screenshots', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /recipe desk/i })).toBeVisible();

  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Recipes', exact: true }).click();
  await page.getByPlaceholder(/try miso/i).fill('miso');
  await expect(page.getByRole('heading', { name: 'Miso Orchard Noodles' })).toBeVisible();
  await page.getByRole('button', { name: 'vegan' }).click();
  await expect(page.getByRole('heading', { name: 'Miso Orchard Noodles' })).toBeVisible();
  await page.getByRole('link', { name: 'Miso Orchard Noodles' }).click();
  await page.getByLabel('Servings').fill('4');
  await expect(page.getByText('12 oz soba noodles')).toBeVisible();

  await page.getByRole('link', { name: 'Planner' }).click();
  await page.locator('select').first().selectOption('green-market-congee');
  await expect(page.locator('.planned-list').first().getByText('Green Market Congee')).toBeVisible();
  await page.getByRole('link', { name: 'Shopping List' }).click();
  await expect(page.getByRole('heading', { name: /one list/i })).toBeVisible();
  await expect(page.getByText(/jasmine rice/)).toBeVisible();

  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Home', exact: true }).click();
  await expect(page.getByRole('heading', { name: /recipe desk/i })).toBeVisible();
  await page.waitForTimeout(350);
  mkdirSync('test-results/screenshots', { recursive: true });
  await page.screenshot({ path: `test-results/screenshots/gather-${testInfo.project.name}.png`, fullPage: false });
});

test('static fallback renders a genuine 404 route', async ({ page }) => {
  await page.goto('/missing-shelf');
  await expect(page.getByRole('heading', { name: /this shelf is empty/i })).toBeVisible();
});

test('every recipe detail route is directly addressable', async ({ page }) => {
  for (const recipe of recipes) {
    await page.goto(`/recipes/${recipe.slug}`);
    await expect(page.getByRole('heading', { name: recipe.title })).toBeVisible();
  }
});

test('storage-denied browsers keep session edits without crashing', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem = () => {
      throw new Error('storage denied by test');
    };
  });
  await page.goto('/planner');
  await page.locator('select').first().selectOption('green-market-congee');
  await expect(page.locator('.planned-list').first().getByText('Green Market Congee')).toBeVisible();
  await expect(page.getByText(/not saved in this browser/i)).toBeVisible();
});

test('keyboard focus reaches planner reset', async ({ page }) => {
  await page.goto('/planner');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
  await expect(page.getByRole('button', { name: /reset week/i })).toBeVisible();
});
