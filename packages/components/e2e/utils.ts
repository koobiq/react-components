import type { Page } from '@playwright/test';

type StorybookWindow = Window & {
  __STORYBOOK_PREVIEW__?: { currentRender?: { phase?: string } };
};

/** Opens a story in isolation and waits until it has rendered. */
export const e2eGotoStory = async (page: Page, id: string): Promise<void> => {
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

export const e2eEnableDarkTheme = (page: Page): Promise<void> =>
  page.evaluate(() => {
    document.body.classList.remove('kbq-light');
    document.body.classList.add('kbq-dark');
  });
