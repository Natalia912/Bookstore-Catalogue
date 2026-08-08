import { expect, test } from '@playwright/test';

test.describe('homepage catalogue view', () => {
  test('renders the public book list page shell', async ({ page }) => {
    await page.goto('http://localhost:3000/', {
      waitUntil: 'networkidle',
      timeout: 10000,
    });

    await expect(page.getByRole('heading', { name: 'Books' })).toBeVisible();
    await expect(page.getByRole('searchbox', { name: 'Search' })).toBeVisible();

    const pageMain = page.getByRole('main');
    await expect(pageMain).toBeVisible();
  });
});
