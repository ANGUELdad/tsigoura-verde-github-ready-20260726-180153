const { test, expect } = require('@playwright/test');

const viewports = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1280, height: 800 },
  { width: 1440, height: 900 },
];

async function openMenu(page, viewport = viewports[2]) {
  await page.setViewportSize(viewport);
  await page.addInitScript(() => localStorage.setItem('tv_lang', 'el'));
  await page.goto('/');
  await expect(page.locator('#splash')).toBeHidden();
  await expect(page.locator('#root .sec').first()).toBeVisible();
}

test('classic menu has no overflow and uses the correct responsive layout', async ({ page }) => {
  for (const viewport of viewports) {
    await openMenu(page, viewport);
    const dimensions = await page.evaluate(() => ({
      inner: innerWidth,
      scroll: document.documentElement.scrollWidth,
      columns: getComputedStyle(document.querySelector('#root')).gridTemplateColumns,
      sections: document.querySelectorAll('#root > .sec').length,
    }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.inner);
    expect(dimensions.sections).toBeGreaterThanOrEqual(4);
    if (viewport.width >= 1100) {
      expect(dimensions.columns.split(' ').length).toBe(2);
    } else {
      expect(dimensions.columns === 'none' || dimensions.columns.split(' ').length === 1).toBeTruthy();
    }
  }
});

test('mobile controls meet the tap target and search handles empty results', async ({ page }) => {
  await openMenu(page, { width: 320, height: 568 });
  const selectors = [
    '[data-testid="social-open"]',
    '[data-testid="wifi-open"]',
    '[data-testid="language-open"]',
    '[data-testid="search-clear"]',
    '.info-b',
  ];
  for (const selector of selectors) {
    const box = await page.locator(selector).first().boundingBox();
    expect(box.width, selector).toBeGreaterThanOrEqual(43.9);
    expect(box.height, selector).toBeGreaterThanOrEqual(43.9);
  }

  await page.getByTestId('menu-search').fill('ZZZ-NO-MATCH');
  await expect(page.getByText('Δεν βρέθηκε πιάτο')).toBeVisible();
  await page.getByTestId('search-clear').click();
  await expect(page.locator('#root .sec').first()).toBeVisible();
});

test('Wi-Fi sheet closes by button, Escape, and backdrop while restoring focus', async ({ page }) => {
  await openMenu(page, { width: 320, height: 568 });
  const trigger = page.getByTestId('wifi-open');
  await trigger.click();
  const sheet = page.locator('#wifiSheet');
  await expect(sheet).toHaveAttribute('aria-hidden', 'false');
  await expect(sheet.getByText('TSIGOURA 5G')).toBeVisible();
  expect(await sheet.evaluate(el => el.scrollWidth <= el.clientWidth)).toBeTruthy();
  await sheet.getByTestId('sheet-close').click();
  await expect(sheet).toHaveAttribute('aria-hidden', 'true');
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.keyboard.press('Escape');
  await expect(sheet).toHaveAttribute('aria-hidden', 'true');
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.locator('#scrim').click({ position: { x: 4, y: 4 } });
  await expect(sheet).toHaveAttribute('aria-hidden', 'true');
});

test('customer UI never exposes operational status messages', async ({ page }) => {
  await openMenu(page);
  const text = await page.locator('body').innerText();
  expect(text).not.toContain('Το μενού ενημερώθηκε ζωντανά');
  expect(text).not.toContain('ADMIN_PIN');
  expect(text).not.toContain('Vercel');
  expect(text).not.toContain('KV_REST');
});

test('reduced motion disables animated sheet transitions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openMenu(page);
  await page.getByTestId('wifi-open').click();
  const transition = await page.locator('#wifiSheet').evaluate(el => getComputedStyle(el).transitionDuration);
  expect(['0s', '0.01ms']).toContain(transition);
});
