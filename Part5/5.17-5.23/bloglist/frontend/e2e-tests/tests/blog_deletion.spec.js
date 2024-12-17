const { test, expect } = require('@playwright/test');

test.describe('Blog Deletion Tests', () => {
  test.beforeEach(async ({ page }) => {

    await page.goto('http://localhost:5173');
    await page.request.post('http://localhost:3004/api/testing/reset');
    await page.request.post('http://localhost:3004/api/users', {
      data: { username: 'creator', name: 'Test User', password: 'password123' },
    });

    await page.getByRole('button', { name: 'log in' }).click();
    await page.fill('input[name="username"]', 'creator');
    await page.fill('input[name="password"]', 'password123');
    await page.getByRole('button', { name: 'login' }).click();

    await page.getByRole('button', { name: 'new blog' }).click();
    await page.fill('input[name="title"]', 'Blog for Deletion');
    await page.fill('input[name="author"]', 'Test Author');
    await page.fill('input[name="url"]', 'http://example.com');
    await page.getByRole('button', { name: 'create' }).click();
    await page.getByRole('button', { name: 'logout' }).click();
  });

  test('A blog can be deleted by the creator', async ({ page }) => {

    await page.getByRole('button', { name: 'log in' }).click();
    await page.fill('input[name="username"]', 'creator');
    await page.fill('input[name="password"]', 'password123');
    await page.getByRole('button', { name: 'login' }).click();

    await page.getByRole('button', { name: 'view' }).click();
    await page.getByRole('button', { name: 'remove' }).click();

    const notification = page.locator('.notification');
    await expect(notification).toHaveText('Blog removed');
    await expect(page.getByText('Blog for Deletion')).not.toBeVisible();
  });
});
