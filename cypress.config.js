import { defineConfig } from 'cypress';

export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:5173',
        viewportWidth: 1440,
        viewportHeight: 1000,
        video: false,
        screenshotOnRunFailure: true,
        defaultCommandTimeout: 8000,
    },
});