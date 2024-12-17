const { test, expect } = require('@playwright/test');

test.describe('Blog app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.request.post('http://localhost:3004/api/testing/reset');

    await page.request.post('http://localhost:3004/api/users', {
      data: { username: 'user1', name: 'User One', password: 'password123' },
    });
    await page.request.post('http://localhost:3004/api/users', {
      data: { username: 'user2', name: 'User Two', password: 'password123' },
    });
  });

  test('only the user who added the blog sees the delete button', async ({ page }) => {

    await page.getByRole('button', { name: 'log in' }).click();
    await page.fill('input[name="username"]', 'user1');
    await page.fill('input[name="password"]', 'password123');
    await page.getByRole('button', { name: 'login' }).click();

    await page.getByRole('button', { name: 'new blog' }).click();
    await page.fill('input[name="title"]', 'Blog created by user1');
    await page.fill('input[name="author"]', 'User One');
    await page.fill('input[name="url"]', 'http://example.com');
    await page.getByRole('button', { name: 'create' }).click();

    await page.getByRole('button', { name: 'view' }).click();
    const deleteButton = await page.getByRole('button', { name: 'remove' });
    await expect(deleteButton).toBeVisible();

    await page.getByRole('button', { name: 'logout' }).click();

    await page.getByRole('button', { name: 'log in' }).click();
    await page.fill('input[name="username"]', 'user2');
    await page.fill('input[name="password"]', 'password123');
    await page.getByRole('button', { name: 'login' }).click();

    await page.getByRole('button', { name: 'view' }).click();
    const deleteButtonForUser2 = await page.locator('text=remove');
    await expect(deleteButtonForUser2).not.toBeVisible();
  });
});
