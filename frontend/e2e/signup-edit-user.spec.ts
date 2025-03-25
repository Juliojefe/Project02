// frontend/e2e/signup-edit-user.spec.ts
import { test, expect } from '@playwright/test';

test('Sign up and edit username', async ({ page }) => {
    await page.goto('http://localhost:19006');

    await page.getByRole('button', { name: 'Sign Up' }).click();

    await page.getByPlaceholder('Enter your Name').fill('Playwright Tester');
    await page.getByPlaceholder('Enter your Email').fill('playwright@example.com');
    await page.getByPlaceholder('Enter your password').fill('Test@123');
    await page.getByPlaceholder('Re-enter your password').fill('Test@123');
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page.getByText('Welcome, Playwright Tester')).toBeVisible();

    await page.getByRole('button', { name: '⚙️ Settings ⚙️' }).click();
    await page.getByRole('button', { name: /Change Account Details/i }).click();

    await page.getByPlaceholder('Enter new name').fill('Updated Tester');
    await page.getByRole('button', { name: 'Update User' }).click();

    await expect(page.getByText(/User updated successfully/i)).toBeVisible();
});
