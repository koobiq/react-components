import { test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('FileUpload', () => {
  test('state and style', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-fileupload--state-and-style');
    await e2eScreenshotThemes(page, '01');
  });
});
