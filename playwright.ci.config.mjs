import { defineConfig } from '@playwright/test';
import original from './playwright.config.mjs';
// The existing tests and their limits stay intact. Match normal static-host
// asset caching for the source baseline as well as for the ZIP test server.
export default defineConfig({
  ...original,
  webServer: {
    command: 'SCORM_TEST_SOURCE=1 node scripts/serve-scorm.mjs',
    url: 'http://127.0.0.1:4173/',
    reuseExistingServer: false,
  },
});
