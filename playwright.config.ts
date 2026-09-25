import { defineConfig, devices } from '@playwright/test';
import type { ViewportSize } from '@playwright/test';

const isCI = !!process.env.CI;

const viewport: ViewportSize = { width: 1200, height: 720 };

// Not `localhost`: the server and the browser could resolve it to different addresses.
const baseURL = process.env.BASE_URL || 'http://127.0.0.1:6007';

// The Docker image builds Storybook as a layer and only serves it.
const webServerCommand =
  process.env.WEB_SERVER_COMMAND || 'pnpm e2e:build && pnpm e2e:serve';

/** @see https://playwright.dev/docs/test-configuration */
export default defineConfig({
  // No testDir: the package scripts pass their paths, and .gitignore is respected.
  testMatch: '**/*.e2e.ts',
  timeout: 15 * 1000,
  fullyParallel: true,
  forbidOnly: isCI,
  // An unstable test fails the run instead of being hidden by a retry.
  retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  projects: [
    {
      name: 'Chrome',
      use: { ...devices['Desktop Chrome HiDPI'], viewport },
    },
  ],
  expect: {
    toHaveScreenshot: {
      // No platform suffix: the baselines belong to the Docker image in tools/e2e.
      pathTemplate: '{testFileDir}/__screenshots__/{arg}{ext}',
      stylePath: 'tools/e2e/screenshot.css',
      threshold: 0,
      scale: 'device',
      animations: 'disabled',
    },
  },
  webServer: {
    command: webServerCommand,
    url: baseURL,
    timeout: 5 * 60 * 1000,
    reuseExistingServer: !isCI,
  },
  use: {
    baseURL,
    locale: 'en-US',
    timezoneId: 'UTC',
    // Without the screencast: it slows every test down, and a failed comparison has its own images.
    trace: { mode: 'retain-on-failure', screenshots: false },
    contextOptions: { reducedMotion: 'reduce' },
  },
});
