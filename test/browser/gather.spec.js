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
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('gather-test-started')) {
      localStorage.removeItem('what-starter-gather-v1');
      sessionStorage.setItem('gather-test-started', 'yes');
    }
  });
});

test.afterEach(async ({ page }) => {
  expect(page.consoleErrors).toEqual([]);
  const viewportWidth = page.viewportSize().width;
  const widths = await page.evaluate(() => [document.documentElement.scrollWidth, document.body.scrollWidth]);
  for (const width of widths) expect(width).toBeLessThanOrEqual(viewportWidth);
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
  await expect(page.getByRole('button', { name: 'Add to Tuesday' })).toBeVisible();
  await page.getByLabel('Plan this recipe').selectOption('Thursday');
  await page.getByRole('button', { name: 'Add to Thursday' }).click();

  await page.getByRole('link', { name: 'Planner' }).click();
  await expect(page.locator('.day-card').filter({ has: page.getByRole('heading', { name: 'Thursday' }) }).locator('.planned-list').getByText('Miso Orchard Noodles')).toBeVisible();
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

test('recipe detail defaults to the first empty day and refuses duplicate occupied days', async ({ page }) => {
  await page.goto('/recipes/miso-orchard-noodles');
  await expect(page.getByRole('button', { name: 'Add to Tuesday' })).toBeVisible();
  await page.getByLabel('Plan this recipe').selectOption('Monday');
  await page.getByRole('button', { name: 'Add to Monday' }).click();
  await expect(page.locator('#content').getByText(/already planned on Monday/i)).toBeVisible();
  await page.goto('/planner');
  await expect(page.locator('.day-card').filter({ has: page.getByRole('heading', { name: 'Monday' }) }).locator('.planned-list').getByText('Miso Orchard Noodles')).toHaveCount(1);
});

test('keyboard focus reaches planner reset', async ({ page }) => {
  await page.goto('/planner');
  await page.keyboard.press('Tab');
  await expect(page.locator(':focus')).toBeVisible();
  await expect(page.getByRole('button', { name: /reset week/i })).toBeVisible();
});

test('market checks survive navigation and reload and can clear without changing meals', async ({ page }) => {
  await page.goto('/shopping-list');
  const first = page.getByRole('checkbox').first();
  await first.check();
  await expect(page.getByText(/1 picked up/)).toBeVisible();
  await page.getByRole('link', { name: 'Planner', exact: true }).click();
  await page.getByRole('link', { name: 'Shopping List', exact: true }).click();
  await expect(page.getByRole('checkbox').first()).toBeChecked();
  await page.reload();
  await expect(page.getByRole('checkbox').first()).toBeChecked();
  await page.getByRole('button', { name: 'Clear checks' }).click();
  await expect(page.getByRole('checkbox').first()).not.toBeChecked();
  await expect(page.getByText('3 meals planned', { exact: true })).toBeVisible();
});

test('denied storage keeps market check changes in session', async ({ page }) => {
  await page.addInitScript(() => { Storage.prototype.setItem = () => { throw new Error('denied'); }; });
  await page.goto('/shopping-list');
  await page.getByRole('checkbox').first().check();
  await expect(page.getByText(/1 picked up/)).toBeVisible();
  await page.getByRole('link', { name: 'Planner', exact: true }).click();
  await page.getByRole('link', { name: 'Shopping List', exact: true }).click();
  await expect(page.getByRole('checkbox').first()).toBeChecked();
  await expect(page.getByText(/not saved in this browser/i)).toBeVisible();
});

test('build guide keeps literal checklist source readable on mobile', async ({ page }) => {
  await page.goto('/build');
  await expect(page.locator('pre code')).toContainText('setIngredientChecked(ingredientKey(ingredient), event.target.checked)');
});

test('all seeded checklist labels have a44px hit area without stretching checkboxes', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/shopping-list');
    await expect(page.getByRole('checkbox')).toHaveCount(21);
    const geometry = await page.locator('.shopping-row label').evaluateAll(labels => labels.map(label => ({
      label: label.getBoundingClientRect().height,
      checkbox: label.querySelector('input').getBoundingClientRect().width,
    })));
    expect(geometry).toHaveLength(21);
    for (const row of geometry) {
      expect(row.label).toBeGreaterThanOrEqual(44);
      expect(row.checkbox).toBeLessThanOrEqual(24);
    }
  }
});


test('modern typography and touch geometry remain consistent across routes', async ({ page }) => {
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const route of ["/","/recipes/cedar-supper-beans","/planner","/shopping-list","/build"]) {
      await page.goto(route);
      await expect(page.locator('h1')).toBeVisible();
      const metrics = await page.evaluate(() => {
        const heading = getComputedStyle(document.querySelector('h1'));
        const body = getComputedStyle(document.body);
        const targets = [...document.querySelectorAll('nav a, button, .button, a.brand')].filter(node => node.getClientRects().length);
        const navRows = new Map();
        for (const link of document.querySelectorAll('nav a')) {
          const top = Math.round(link.getBoundingClientRect().top);
          navRows.set(top, (navRows.get(top) || 0) + 1);
        }
        return { navRows: [...navRows.values()], heading: parseFloat(heading.fontSize), family: body.fontFamily, body: body.fontSize, overflow: document.documentElement.scrollWidth > innerWidth, smallTargets: targets.filter(node => node.getBoundingClientRect().height < 43.9).map(node => node.textContent) };
      });
      expect(metrics.family).toContain('Avenir Next');
      expect(metrics.body).toBe('16px');
      expect(metrics.heading).toBeGreaterThanOrEqual(28);
      expect(metrics.heading).toBeLessThanOrEqual(36);
      expect(metrics.overflow).toBe(false);
      expect(metrics.smallTargets).toEqual([]);
      if (viewport.width === 390) expect(metrics.navRows).toEqual([3, 2]);
      const firstNav = page.locator('nav a').first();
      await firstNav.focus();
      await expect(firstNav).toHaveCSS('outline-style', 'solid');
    }
  }
});
