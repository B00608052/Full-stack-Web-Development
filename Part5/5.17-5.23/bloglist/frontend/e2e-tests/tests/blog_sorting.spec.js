const { test, expect } = require('@playwright/test');

test.describe('Blog app - Blog Sorting by Likes', () => {
  test.beforeEach(async ({ page }) => {

    await page.request.post('http://localhost:3004/api/testing/reset');
    await page.request.post('http://localhost:3004/api/users', {
      data: { username: 'testuser', name: 'Test User', password: 'password123' },
    });

    await page.goto('http://localhost:5173');
    await page.getByRole('button', { name: 'log in' }).click();
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');
    await page.getByRole('button', { name: 'login' }).click();

    const blogs = [
      { title: 'First Blog', author: 'Author 1', url: 'http://blog1.com' },
      { title: 'Second Blog', author: 'Author 2', url: 'http://blog2.com' },
      { title: 'Third Blog', author: 'Author 3', url: 'http://blog3.com' },
    ];

    for (const blog of blogs) {
      await page.getByRole('button', { name: 'new blog' }).click();
      await page.fill('input[name="title"]', blog.title);
      await page.fill('input[name="author"]', blog.author);
      await page.fill('input[name="url"]', blog.url);
      await page.getByRole('button', { name: 'create' }).click();
    }

    await page.getByRole('button', { name: 'logout' }).click();
  });

  test('Blogs are sorted by the number of likes in descending order', async ({ page }) => {

    await page.getByRole('button', { name: 'log in' }).click();
    await page.fill('input[name="username"]', 'testuser');
    await page.fill('input[name="password"]', 'password123');
    await page.getByRole('button', { name: 'login' }).click();

    const blogTitles = ['First Blog', 'Second Blog', 'Third Blog'];

    await page.getByText('Second Blog').locator('..').getByRole('button', { name: 'view' }).click();
    await page.getByRole('button', { name: 'like' }).click();
    await page.getByRole('button', { name: 'like' }).click();

    await page.getByText('First Blog').locator('..').getByRole('button', { name: 'view' }).click();
    await page.getByRole('button', { name: 'like' }).click();

    const blogElements = await page.locator('.blog').all();
    const blogTexts = await Promise.all(blogElements.map((blog) => blog.textContent()));

    expect(blogTexts[0]).toContain('Second Blog');
    expect(blogTexts[1]).toContain('First Blog');
    expect(blogTexts[2]).toContain('Third Blog');
  });
});
