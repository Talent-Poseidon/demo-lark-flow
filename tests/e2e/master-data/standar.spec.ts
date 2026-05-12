import { test, expect } from '@playwright/test';

test.describe('Admin can manage Standar submissions', () => {
  test.beforeEach(async ({ page }) => {
    const title = test.info().title;
    console.log(`[Test: ${title}] Navigating to /admin/standar...`);

    const response = await page.goto('/admin/standar');
    console.log(`[Test: ${title}] Status: ${response?.status()} | URL: ${page.url()}`);

    await expect(page).toHaveURL(/\/admin\/standar/);
    await expect(page.getByTestId('standar-page-nav')).toBeVisible();
  });

  test('Admin views the standar list', async ({ page }) => {
    await expect(page.getByTestId('standar-list-container')).toBeVisible();

    // Wait for async data to load
    const firstItem = page.locator('[data-testid^="standar-item-"]').first();
    await expect(firstItem).toBeVisible({ timeout: 10000 });

    const count = await page.locator('[data-testid^="standar-item-"]').count();
    console.log(`[Standar List] Found ${count} items`);
    expect(count).toBeGreaterThan(0);
  });

  test('Admin submits a new standar', async ({ page }) => {
    const uniqueTitle = `E2E Standar ${Date.now()}`;
    const uniqueDesc = `E2E job standard description ${Date.now()}`;

    await page.getByTestId('standar-jobTitle-input').fill(uniqueTitle);
    await page.getByTestId('standar-description-input').fill(uniqueDesc);
    await page.getByTestId('submit-standar-btn').click();

    await expect(page.getByTestId('standar-created-alert'))
      .toContainText('Standar Submitted');
    console.log(`[Standar] Created: ${uniqueTitle}`);
  });

  test('Admin sees validation error for empty standar form', async ({ page }) => {
    await page.getByTestId('submit-standar-btn').click();

    await expect(page.getByTestId('standar-error-alert'))
      .toContainText('All fields are required');
  });
});
