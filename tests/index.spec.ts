import { test, expect } from '@playwright/test';
import { DARWIN_MOCK_TOURNAMENT } from './mocks';

test('has title', async ({ page }) => {
  await page.route('/api/tournaments', async route => {
    await route.fulfill({ json: [DARWIN_MOCK_TOURNAMENT] });
  });

  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page.locator('text=pokéstats.live')).toBeVisible();
});
