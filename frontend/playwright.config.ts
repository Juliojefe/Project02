import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    // ✅ Put slowMo inside launchOptions in the project config
    projects: [
        {
            timeout: 60000,
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                launchOptions: {
                    slowMo: 1500,         // 👈 This is the valid spot
                    headless: false
                },
            },
        },
    ],
});
