import { test, expect } from '@playwright/test';

test('tenant dashboard loads correctly for Delhi Public School', async ({ page }) => {
  await page.goto('/?school=dps');
  await expect(page.locator('text=Delhi Public School')).toBeVisible();
  await expect(page.locator('text=Campus Operations & Analytics')).toBeVisible();
});

test('tenant dashboard loads correctly for Greenwood High', async ({ page }) => {
  await page.goto('/?school=greenwood');
  await expect(page.locator('text=Greenwood High International')).toBeVisible();
});

test('public signup page renders correctly', async ({ page }) => {
  await page.goto('/signup');
  await expect(page.locator('text=Provision New Institution')).toBeVisible();
  await expect(page.locator('input[placeholder="e.g. Oakridge Academy"]')).toBeVisible();
});

test('system status page reports operational health', async ({ page }) => {
  await page.goto('/status');
  await expect(page.locator('text=All Core Services Are Functioning Normally')).toBeVisible();
});
