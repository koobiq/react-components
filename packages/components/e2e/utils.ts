import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

type StorybookWindow = Window & {
  __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } };
};

/** Opens a story in isolation and waits until it has rendered. */
export const e2eGotoStory = async (page: Page, id: string): Promise<void> => {
  // A fixed date, so that "today" in calendars and date inputs does not change the screenshots.
  await page.clock.setFixedTime(new Date('2026-01-15T10:00:00Z'));

  // a11y.manual skips the axe audit the a11y addon runs after every render.
  await page.goto(
    `/iframe.html?id=${id}&viewMode=story&globals=a11y.manual:!true`
  );

  const phase = await page
    .waitForFunction(() => {
      if (document.body.classList.contains('sb-show-errordisplay')) {
        return 'errored';
      }

      const preview = (window as StorybookWindow).__STORYBOOK_PREVIEW__;
      const current = preview?.currentRender?.phase;

      return ['finished', 'errored', 'aborted'].includes(current ?? '')
        ? current
        : undefined;
    })
    .then((handle) => handle.jsonValue());

  if (phase !== 'finished') {
    const message = await page.evaluate(() =>
      document.getElementById('error-message')?.textContent?.trim()
    );

    throw new Error(
      `The story "${id}" did not render (${phase}): ${message || 'no message'}`
    );
  }
};

/**
 * Screenshots the target in the light theme, then in the dark one, as `<name>-light.png` and
 * `<name>-dark.png`. The target defaults to the element marked `data-testid="e2eScreenshotTarget"`.
 */
export const e2eScreenshotThemes = async (
  page: Page,
  name: string,
  target: Locator = page.getByTestId('e2eScreenshotTarget')
): Promise<void> => {
  await expect(target).toHaveScreenshot(`${name}-light.png`);

  await page.evaluate(() => {
    document.body.classList.remove('kbq-light');
    document.body.classList.add('kbq-dark');
  });

  await expect(target).toHaveScreenshot(`${name}-dark.png`);

  // Back to the light theme, so that a second call in the same test starts from it.
  await page.evaluate(() => {
    document.body.classList.remove('kbq-dark');
    document.body.classList.add('kbq-light');
  });
};
