const { test, expect } = require('@playwright/test');

test.describe('Blog app', () => {
  test.beforeEach(async ({ page }) => {

    await page.goto('http://localhost:5173');

    await page.fill('input[name="username"]', 'testuser'); 
    await page.fill('input[name="password"]', 'password123'); 
    await page.click('button:has-text("login")');

    await expect(page.getByText('testuser logged in')).toBeVisible();
  });

  test('a new blog can be created', async ({ page }) => {
    await page.click('button:has-text("new blog")');

    await page.fill('input[name="title"]', 'E2E Test Blog');
    await page.fill('input[name="author"]', 'Test Author');
    await page.fill('input[name="url"]', 'http://test-url.com');

    await page.click('button:has-text("create")');

    await expect(page.getByText('E2E Test Blog Test Author')).toBeVisible();
  });
});
