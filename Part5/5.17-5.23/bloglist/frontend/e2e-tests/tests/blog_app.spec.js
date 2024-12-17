const { test, expect } = require('@playwright/test');

test.describe('Blog app', () => {
  test.beforeEach(async ({ page }) => {

    await page.goto('http://localhost:5173');
    await page.request.post('http://localhost:3004/api/testing/reset');
    await page.request.post('http://localhost:3004/api/users', {
      data: { username: 'testuser', name: 'Test User', password: 'password123' },
    });
  });

  test('Login succeeds with correct credentials', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click();
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');
    await page.getByRole('button', { name: 'login' }).click();

    const logoutButton = await page.getByRole('button', { name: 'logout' });
    await expect(logoutButton).toBeVisible();
  });

  test('Login fails with wrong credentials', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click();
    await page.fill('input[name="username"]', 'wronguser');
    await page.fill('input[name="password"]', 'wrongpass');
    await page.getByRole('button', { name: 'login' }).click();

    const notification = await page.locator('.error');
    await expect(notification).toHaveText('Wrong username or password');
  });

  test('a blog can be liked', async ({ page }) => {

    await page.getByRole('button', { name: 'log in' }).click();
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');
    await page.getByRole('button', { name: 'login' }).click();

    await expect(page.locator('text=testuser logged in')).toBeVisible();

    await page.getByRole('button', { name: 'new blog' }).click();
    await page.fill('input[name="title"]', 'Test Blog');
    await page.fill('input[name="author"]', 'Test Author');
    await page.fill('input[name="url"]', 'http://testblog.com');
    await page.getByRole('button', { name: 'create' }).click();

    await page.getByRole('button', { name: 'view' }).click();

    const likeButton = page.getByRole('button', { name: 'like' });
    const likesElement = page.locator('.likes-count');

    const initialLikes = await likesElement.innerText();
    await likeButton.click();
    const updatedLikes = await likesElement.innerText();

    expect(Number(updatedLikes)).toBe(Number(initialLikes) + 1);
  });

  test('A blog can be deleted by the creator', async ({ page }) => {
    await page.getByText('view').click();
    await page.getByText('remove').click();
  
    const blogTitle = await page.locator('.blog-title-author');
    await expect(blogTitle).not.toBeVisible();
  });
  
});
