// frontend/playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',         // 👈 Only look here
    testMatch: '**/*.spec.ts', // Optional: only pick *.spec.ts
    use: {
        headless: false,
        viewport: { width: 1280, height: 720 },
        baseURL: 'http://localhost:19006',
    },
});
