const { test, expect } = require('@playwright/test');

async function login(page, viewport = { width: 390, height: 844 }) {
  await page.setViewportSize(viewport);
  await page.goto('/admin.html');
  if (await page.getByTestId('admin-pin').isVisible()) {
    await page.getByTestId('admin-pin').fill('ui-test-owner');
    await page.getByTestId('admin-login').click();
  }
  await expect(page.locator('#adminApp')).toBeVisible();
}

test('login is owner-friendly and reports validation without technical jargon', async ({ page }) => {
  await page.goto('/admin.html');
  const loginText = await page.locator('#loginScreen').innerText();
  expect(loginText).not.toContain('Vercel');
  expect(loginText).not.toContain('ADMIN_PIN');
  expect(loginText).not.toContain('1234');
  await page.getByTestId('admin-login').click();
  await expect(page.locator('#loginStatus')).toContainText('Γράψτε');
  await page.getByTestId('admin-pin').fill('wrong');
  await page.getByTestId('admin-login').click();
  await expect(page.locator('#loginStatus')).toContainText('δεν είναι σωστός');
});

test('admin has no horizontal overflow at required layouts', async ({ page }) => {
  const viewports = [
    { width: 320, height: 568 },
    { width: 360, height: 800 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
  ];
  for (const viewport of viewports) {
    await login(page, viewport);
    const dims = await page.evaluate(() => ({
      inner: innerWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(dims.scroll).toBeLessThanOrEqual(dims.inner);
  }
});

test('traditional mode hides inactive table and ordering systems', async ({ page }) => {
  await login(page);
  await expect(page.getByTestId('admin-tab-tables')).toBeHidden();
  await expect(page.getByTestId('admin-tab-orders')).toBeHidden();
  await page.getByTestId('admin-tab-settings').click();
  await page.locator('[data-set="traditionalMenuOnly"]').click();
  await expect(page.getByTestId('admin-tab-tables')).toBeVisible();
  await expect(page.getByTestId('admin-tab-orders')).toBeVisible();
});

test('original categories can hide, auto-hide when empty, and reappear', async ({ page }) => {
  await login(page, { width: 1280, height: 800 });
  await page.getByTestId('admin-tab-menu').click();
  await page.locator('#modeSwitch [data-mode="pro"]').click();
  const categoryNames = await page.locator('.cat-edit [data-cat-name]').evaluateAll(inputs => inputs.map(input => input.value));
  expect(categoryNames).toEqual(expect.arrayContaining(['Ορεκτικά', 'Σαλάτες', 'Της ώρας', 'Ποτά']));
  await expect(page.locator('[data-cat-del]')).toHaveCount(0);

  const firstCategoryId = await page.locator('.cat-edit').first().getAttribute('data-id');
  const toggle = page.getByTestId(`category-visibility-${firstCategoryId}`);
  await toggle.click();
  await expect(page.locator('.cat-edit').first()).toHaveClass(/hidden/);
  await page.getByTestId(`category-visibility-${firstCategoryId}`).click();
  await expect(page.locator('.cat-edit').first()).not.toHaveClass(/hidden/);

  await page.evaluate(categoryId => {
    S.menu.filter(item => item.cat === categoryId).forEach(item => { item.hidden = true; });
    persist('ui-auto-hide-test');
    renderPro();
  }, firstCategoryId);
  await expect(page.locator('.cat-edit').first().locator('.cat-state')).toContainText('Αυτόματη απόκρυψη');

  await page.evaluate(categoryId => {
    const item = S.menu.find(entry => entry.cat === categoryId);
    if (item) item.hidden = false;
    persist('ui-auto-show-test');
    renderPro();
  }, firstCategoryId);
  await expect(page.locator('.cat-edit').first().locator('.cat-state')).not.toContainText('Αυτόματη απόκρυψη');
});

test('device upload and manual path controls remain available', async ({ page }) => {
  await login(page, { width: 390, height: 844 });
  await page.getByTestId('admin-tab-menu').click();
  await page.locator('#modeSwitch [data-mode="pro"]').click();
  const firstDish = page.locator('.pro-item').first();
  await firstDish.locator('.pro-head').click();
  await expect(firstDish.locator('[data-image]')).toBeVisible();
  await expect(firstDish.locator('[data-image-file]')).toHaveAttribute('accept', /image/);
  await expect(firstDish.locator('.upload-pick')).toContainText('Από συσκευή');
});
