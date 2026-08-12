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

test('admin can add, edit, hide, and delete categories and dishes', async ({ page }) => {
  await login(page, { width: 1280, height: 800 });
  await page.getByTestId('admin-tab-menu').click();
  await page.locator('#modeSwitch [data-mode="pro"]').click();
  const categoryNames = await page.locator('.cat-edit [data-cat-name]').evaluateAll(inputs => inputs.map(input => input.value));
  expect(categoryNames).toEqual(expect.arrayContaining(['Ορεκτικά', 'Σαλάτες', 'Της ώρας', 'Ποτά']));

  const beforeCats = await page.locator('.cat-edit').count();
  await page.getByTestId('add-category').click();
  await expect(page.locator('.cat-edit')).toHaveCount(beforeCats + 1);
  const newCat = page.locator('.cat-edit').last();
  await newCat.locator('[data-cat-name]').fill('Test Category');
  await newCat.locator('[data-cat-save]').click();
  await expect(newCat.locator('[data-cat-name]')).toHaveValue('Test Category');

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

  page.once('dialog', dialog => dialog.accept());
  await newCat.locator('[data-cat-del]').click();
  await expect(page.locator('.cat-edit')).toHaveCount(beforeCats);

  const beforeDishes = await page.locator('.pro-item').count();
  await page.getByTestId('admin-add-dish').click();
  await expect(page.locator('.pro-item')).toHaveCount(beforeDishes + 1);
  const newDish = page.locator('.pro-item.open').first();
  await expect(newDish).toBeVisible();
  const dishName = `CRUD Guest ${Date.now()}`;
  await newDish.locator('[data-n]').fill(dishName);
  await newDish.locator('[data-price]').fill('6.50');
  await newDish.locator('[data-save]').click();
  await expect(page.locator('.pro-item').filter({ hasText: dishName }).first()).toBeVisible();
  await expect.poll(async () => page.locator('#syncText').innerText(), { timeout: 8000 }).toContain('Δημοσιεύτηκε');
});

test('admin dish edits appear on the guest menu via /api/menu', async ({ page, browser }) => {
  await login(page, { width: 1280, height: 800 });
  await page.getByTestId('admin-tab-menu').click();
  await page.locator('#modeSwitch [data-mode="pro"]').click();
  const dishName = `Live Guest ${Date.now()}`;
  await page.getByTestId('admin-add-dish').click();
  const newDish = page.locator('.pro-item.open').first();
  await expect(newDish).toBeVisible();
  await newDish.locator('[data-n]').fill(dishName);
  await newDish.locator('[data-price]').fill('7.25');
  await newDish.locator('[data-save]').click();
  await expect.poll(async () => {
    const res = await page.request.get('/api/menu');
    const data = await res.json();
    const names = ((data.state && data.state.menu) || []).map(i => (i.t && i.t.el && i.t.el.n) || '');
    return names.includes(dishName);
  }, { timeout: 10000 }).toBe(true);

  const guest = await browser.newPage();
  await guest.addInitScript(() => {
    localStorage.clear();
    localStorage.setItem('tv_lang', 'el');
  });
  await guest.goto('/');
  await expect(guest.locator('#splash')).toBeHidden();
  await expect(guest.getByText(dishName, { exact: false })).toBeVisible({ timeout: 10000 });
  await guest.close();
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
