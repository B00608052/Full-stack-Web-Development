const { test, expect } = require('@playwright/test');

test.describe('Blog app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.request.post('http://localhost:3004/api/testing/reset');
    await page.request.post('http://localhost:3004/api/users', {
      data: { username: 'testuser', name: 'Test User', password: 'password123' },
    });

    await page.getByRole('button', { name: 'log in' }).click();
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');
    await page.getByRole('button', { name: 'login' }).click();

    await page.getByRole('button', { name: 'new blog' }).click();
    await page.fill('input[name="title"]', 'New Blog');
    await page.fill('input[name="author"]', 'Test Author');
    await page.fill('input[name="url"]', 'http://example.com');
    await page.getByRole('button', { name: 'create' }).click();
  });

  test('a blog can be liked', async ({ page }) => {
    await page.getByRole('button', { name: 'view' }).click();

    const likeButton = page.getByRole('button', { name: 'like' });
    const likes = page.locator('.likes-count');

    const initialLikes = await likes.innerText();

    await likeButton.click();
    await expect(likes).toHaveText((Number(initialLikes) + 1).toString());
  });
});
