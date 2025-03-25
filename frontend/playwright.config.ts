// frontend/playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './e2e', // 🔥 ONLY run tests from this folder
    testMatch: '**/*.spec.ts',
    use: {
        baseURL: 'http://localhost:19006',
        headless: false,
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
    },
});
