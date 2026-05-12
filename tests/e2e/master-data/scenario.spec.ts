import { test, expect } from '@playwright/test';

test.describe('Admin can manage Scenario submissions', () => {
  test.beforeEach(async ({ page }) => {
    const title = test.info().title;
    console.log(`[Test: ${title}] Navigating to /admin/scenario...`);

    const response = await page.goto('/admin/scenario');
    console.log(`[Test: ${title}] Status: ${response?.status()} | URL: ${page.url()}`);

    await expect(page).toHaveURL(/\/admin\/scenario/);
    await expect(page.getByTestId('scenario-page-nav')).toBeVisible();
  });

  test('Admin views the scenario list', async ({ page }) => {
    await expect(page.getByTestId('scenario-list-container')).toBeVisible();

    // Wait for async data to load
    const firstItem = page.locator('[data-testid^="scenario-item-"]').first();
    await expect(firstItem).toBeVisible({ timeout: 10000 });

    const count = await page.locator('[data-testid^="scenario-item-"]').count();
    console.log(`[Scenario List] Found ${count} items`);
    expect(count).toBeGreaterThan(0);
  });

  test('Admin submits a new scenario', async ({ page }) => {
    const uniqueTitle = `E2E Scenario ${Date.now()}`;
    const uniqueDesc = `E2E scenario description ${Date.now()}`;

    await page.getByTestId('scenario-title-input').fill(uniqueTitle);
    await page.getByTestId('scenario-description-input').fill(uniqueDesc);
    await page.getByTestId('submit-scenario-btn').click();

    await expect(page.getByTestId('scenario-created-alert'))
      .toContainText('Scenario Submitted');
    console.log(`[Scenario] Created: ${uniqueTitle}`);
  });

  test('Admin sees validation error for empty scenario form', async ({ page }) => {
    await page.getByTestId('submit-scenario-btn').click();

    await expect(page.getByTestId('scenario-error-alert'))
      .toContainText('All fields are required');
  });
});
