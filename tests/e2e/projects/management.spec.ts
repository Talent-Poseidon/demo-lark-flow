import { test, expect } from '@playwright/test';

test.describe('Admin can manage projects', () => {
  test.beforeEach(async ({ page }) => {
    const title = test.info().title;
    console.log(`[Test: ${title}] Navigating to /admin/projects...`);

    const response = await page.goto('/admin/projects');
    console.log(`[Test: ${title}] Status: ${response?.status()} | URL: ${page.url()}`);

    await expect(page).toHaveURL(/\/admin\/projects/);
    await expect(page.getByTestId('project-page-nav')).toBeVisible();
  });

  test('Admin views the project list', async ({ page }) => {
    await expect(page.getByTestId('project-list-container')).toBeVisible();

    // Wait for async data to load
    const firstItem = page.locator('[data-testid^="project-item-"]').first();
    await expect(firstItem).toBeVisible({ timeout: 10000 });

    const count = await page.locator('[data-testid^="project-item-"]').count();
    console.log(`[Project List] Found ${count} items`);
    expect(count).toBeGreaterThan(0);
  });

  test('Admin creates a new project', async ({ page }) => {
    const uniqueName = `E2E Project ${Date.now()}`;

    await page.getByTestId('project-name-input').fill(uniqueName);
    await page.getByTestId('start-date-input').fill('2026-06-01');
    await page.getByTestId('end-date-input').fill('2026-12-31');
    await page.getByTestId('submit-project-btn').click();

    await expect(page.getByTestId('project-created-alert'))
      .toContainText('Project created successfully');
    console.log(`[Project] Created: ${uniqueName}`);
  });

  test('Admin sees validation error for empty project form', async ({ page }) => {
    await page.getByTestId('submit-project-btn').click();

    await expect(page.getByTestId('project-error-alert'))
      .toContainText('All fields are required');
  });

  test('Admin sees date validation error when end date is before start date', async ({ page }) => {
    await page.getByTestId('project-name-input').fill('Invalid Date Project');
    await page.getByTestId('start-date-input').fill('2026-12-31');
    await page.getByTestId('end-date-input').fill('2026-01-01');
    await page.getByTestId('submit-project-btn').click();

    await expect(page.getByTestId('date-error-alert'))
      .toContainText('End date must be after start date');
  });
});

test.describe('Admin can assign assessors to projects', () => {
  test.beforeEach(async ({ page }) => {
    const title = test.info().title;
    console.log(`[Test: ${title}] Navigating to /admin/projects...`);

    const response = await page.goto('/admin/projects');
    console.log(`[Test: ${title}] Status: ${response?.status()} | URL: ${page.url()}`);

    await expect(page).toHaveURL(/\/admin\/projects/);
    await expect(page.getByTestId('project-page-nav')).toBeVisible();
  });

  test('Admin views the assessor assignment list', async ({ page }) => {
    await expect(page.getByTestId('assessor-list-container')).toBeVisible();

    const firstItem = page.locator('[data-testid^="assessor-item-"]').first();
    await expect(firstItem).toBeVisible({ timeout: 10000 });

    const count = await page.locator('[data-testid^="assessor-item-"]').count();
    console.log(`[Assessor List] Found ${count} items`);
    expect(count).toBeGreaterThan(0);
  });

  test('Admin assigns an assessor to a project', async ({ page }) => {
    // Wait for projects to load in the select
    const firstProjectItem = page.locator('[data-testid^="project-item-"]').first();
    await expect(firstProjectItem).toBeVisible({ timeout: 10000 });

    // Open select and pick a project
    await page.getByTestId('assessor-project-select').click();
    await page.locator('[role="option"]').first().click();

    const uniqueName = `E2E Assessor ${Date.now()}`;
    await page.getByTestId('assessor-name-input').fill(uniqueName);
    await page.getByTestId('assessor-email-input').fill(`assessor-${Date.now()}@example.com`);
    await page.getByTestId('submit-assessor-btn').click();

    await expect(page.getByTestId('assessor-assigned-alert'))
      .toContainText('Assessor assigned successfully');
    console.log(`[Assessor] Assigned: ${uniqueName}`);
  });

  test('Admin sees validation error for empty assessor form', async ({ page }) => {
    await page.getByTestId('submit-assessor-btn').click();

    await expect(page.getByTestId('assessor-error-alert'))
      .toContainText('All fields are required');
  });
});

test.describe('Admin can notify assessees about projects', () => {
  test.beforeEach(async ({ page }) => {
    const title = test.info().title;
    console.log(`[Test: ${title}] Navigating to /admin/projects...`);

    const response = await page.goto('/admin/projects');
    console.log(`[Test: ${title}] Status: ${response?.status()} | URL: ${page.url()}`);

    await expect(page).toHaveURL(/\/admin\/projects/);
    await expect(page.getByTestId('project-page-nav')).toBeVisible();
  });

  test('Admin views the notification list', async ({ page }) => {
    await expect(page.getByTestId('notification-list-container')).toBeVisible();

    const firstItem = page.locator('[data-testid^="notification-item-"]').first();
    await expect(firstItem).toBeVisible({ timeout: 10000 });

    const count = await page.locator('[data-testid^="notification-item-"]').count();
    console.log(`[Notification List] Found ${count} items`);
    expect(count).toBeGreaterThan(0);
  });

  test('Admin sends a notification to an assessee', async ({ page }) => {
    // Wait for projects to load in the select
    const firstProjectItem = page.locator('[data-testid^="project-item-"]').first();
    await expect(firstProjectItem).toBeVisible({ timeout: 10000 });

    // Open select and pick a project
    await page.getByTestId('notification-project-select').click();
    await page.locator('[role="option"]').first().click();

    const uniqueName = `E2E Assessee ${Date.now()}`;
    await page.getByTestId('assessee-name-input').fill(uniqueName);
    await page.getByTestId('assessee-email-input').fill(`assessee-${Date.now()}@example.com`);
    await page.getByTestId('notification-message-input').fill('You have been added to the project');
    await page.getByTestId('submit-notification-btn').click();

    await expect(page.getByTestId('notification-sent-alert'))
      .toContainText('Assessee notified successfully');
    console.log(`[Notification] Sent to: ${uniqueName}`);
  });

  test('Admin sees validation error for empty notification form', async ({ page }) => {
    await page.getByTestId('submit-notification-btn').click();

    await expect(page.getByTestId('notification-error-alert'))
      .toContainText('All fields are required');
  });
});
