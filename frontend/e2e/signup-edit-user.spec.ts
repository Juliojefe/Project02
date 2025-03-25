import { test, expect } from '@playwright/test';

test('Sign up, log in, and edit username', async ({ page }) => {
    const email = `user${Date.now()}@example.com`;
    const password = 'Passw0rd!';
    const newName = 'Updated Name';

    // Go to home/login
    await page.goto('http://localhost:8081');
    await page.getByText('Create new account', { exact: true }).click();

    // Fill signup form
    await page.getByPlaceholder('Enter your Name').fill('Test User');
    await page.getByPlaceholder('Enter your Email').fill(email);
    const passwordFields = page.getByPlaceholder('Enter your password');
    await passwordFields.nth(0).fill(password); // First password field
    await page.getByPlaceholder('Re-enter your password').fill(password);
    await page.waitForTimeout(1500); // waits 1000ms = 1 sec

    // Click sign up
    await page.getByText('Sign up', { exact: true }).click();


    // Wait for login to load
    await page.waitForURL('**/login');
    await page.waitForSelector('input[placeholder="Enter your email"]');

    // Fill login form
    await page.getByPlaceholder('Enter your email').fill(email);
    await page.getByPlaceholder('Enter your password').fill(password);
    await page.waitForTimeout(1500); // waits 1000ms = 1 sec

    // Click login
    await page.getByText('Log In', { exact: true }).click();
    await page.waitForTimeout(1500); // waits 1000ms = 1 sec


    // Wait for landing page
    await page.waitForURL('**/landing?userID=*');
    await page.waitForTimeout(1500); // waits 1000ms = 1 sec

    const url = page.url();
    const userIDMatch = url.match(/userID=(\d+)/);
    const userID = userIDMatch?.[1];
    expect(userID).toBeTruthy();

    // Navigate to settings
    await page.getByText('Settings', { exact: true }).click();
    await page.waitForTimeout(1500); // waits 1000ms = 1 sec

    await page.waitForURL(`**/settings?userID=${userID}`);

    // Go to edit page
    await page.getByText('Change Account Details', { exact: true }).click();

    await page.waitForURL(`**/editUser?userID=${userID}`);

    // Edit username
    await page.locator('input[value="Test User"]').fill('Happy Tuesday');
    await page.getByPlaceholder('Enter new image URL').fill("www.act-like-you-see-an-image.com");

    await page.getByText('Save Changes', { exact: true }).click();


    // Then we go do delete that test account
    // Navigate to settings Again!
    await page.getByText('Settings', { exact: true }).click();
    await page.waitForTimeout(1500); // waits 1000ms = 1 sec

    await page.waitForURL(`**/settings?userID=${userID}`);
    await page.getByText('Delete Account', { exact: true }).click();
    await passwordFields.nth(0).fill(password); // First password field
    await page.getByPlaceholder('Re-enter your password').fill(password);

    await page.waitForTimeout(1000); // waits 1000ms = 1 sec

    await page.getByText('Delete Account', { exact: true }).click();

});
