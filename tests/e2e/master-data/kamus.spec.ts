import { test, expect } from '@playwright/test';

test.describe('Admin can manage Kamus submissions', () => {
  test.beforeEach(async ({ page }) => {
    const title = test.info().title;
    console.log(`[Test: ${title}] Navigating to /admin/kamus...`);

    const response = await page.goto('/admin/kamus');
    console.log(`[Test: ${title}] Status: ${response?.status()} | URL: ${page.url()}`);

    await expect(page).toHaveURL(/\/admin\/kamus/);
    await expect(page.getByTestId('kamus-page-nav')).toBeVisible();
  });

  test('Admin views the kamus list', async ({ page }) => {
    await expect(page.getByTestId('kamus-list-container')).toBeVisible();

    // Wait for async data to load
    const firstItem = page.locator('[data-testid^="kamus-item-"]').first();
    await expect(firstItem).toBeVisible({ timeout: 10000 });

    const count = await page.locator('[data-testid^="kamus-item-"]').count();
    console.log(`[Kamus List] Found ${count} items`);
    expect(count).toBeGreaterThan(0);
  });

  test('Admin submits a new kamus template', async ({ page }) => {
    const uniqueName = `E2E Kamus ${Date.now()}`;
    const uniqueFile = `e2e-template-${Date.now()}.xlsx`;

    await page.getByTestId('kamus-templateName-input').fill(uniqueName);
    await page.getByTestId('kamus-fileName-input').fill(uniqueFile);
    await page.getByTestId('submit-kamus-btn').click();

    await expect(page.getByTestId('kamus-created-alert'))
      .toContainText('Kamus Submitted');
    console.log(`[Kamus] Created: ${uniqueName}`);
  });

  test('Admin sees validation error for empty kamus form', async ({ page }) => {
    await page.getByTestId('submit-kamus-btn').click();

    await expect(page.getByTestId('kamus-error-alert'))
      .toContainText('All fields are required');
  });
});
