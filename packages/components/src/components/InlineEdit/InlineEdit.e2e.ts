import { expect, test } from '@playwright/test';

import { e2eGotoStory, e2eScreenshotThemes } from '../../../e2e/utils';

test.describe('InlineEdit', () => {
  test('view states', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--view-states');
    await e2eScreenshotThemes(page, '01');
  });

  test('clips a long view value inside the trigger', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--view-overflow');

    const root = page.getByTestId('overflow-root');

    const content = root.locator(
      '[data-slot="inline-edit-view-container"] > div'
    );

    expect(
      await root.evaluate(
        (element) => element.scrollWidth <= element.clientWidth
      )
    ).toBe(true);

    await expect(content).toHaveCSS('overflow', 'hidden');
    await expect(content).toHaveCSS('text-overflow', 'ellipsis');
    await expect(content).toHaveCSS('white-space', 'nowrap');
  });

  test('updates the controlled example view only after saving', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--controlled-view-interaction');

    const view = page.locator('[data-slot="inline-edit-view-container"]');
    await view.getByRole('button').click();

    const input = page.getByRole('textbox', { name: 'Name' });
    await input.fill('Platform');
    await expect(view).toHaveText('Security team');

    await input.press('Enter');
    await expect(view).toHaveText('Platform');

    await view.getByRole('button').click();
    await input.fill('Discarded');
    await input.press('Escape');
    await expect(view).toHaveText('Platform');
  });

  test('edit state', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--edit-state');
    await e2eScreenshotThemes(page, '02');
  });

  test('edit state without label', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--edit-state-without-label');
    await e2eScreenshotThemes(page, '03');
  });

  test('action buttons state', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--actions-state');

    await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel' })).toBeVisible();

    const panel = page.locator('[data-slot="inline-edit-panel"]');
    const panelBox = await panel.boundingBox();

    const inputBox = await page
      .getByRole('textbox', { name: 'Value' })
      .boundingBox();

    const actionsBox = await page
      .locator('[data-slot="inline-edit-action-buttons"]')
      .boundingBox();

    expect(panelBox!.height).toBeCloseTo(inputBox!.height, 5);

    expect(actionsBox!.y).toBeGreaterThanOrEqual(
      panelBox!.y + panelBox!.height
    );

    await expect(panel).toHaveCSS('box-shadow', 'none');

    const actionShadows = await page
      .locator('[data-slot="inline-edit-action-button"]')
      .evaluateAll((elements) =>
        elements.map((element) => getComputedStyle(element).boxShadow)
      );

    expect(actionShadows).toHaveLength(2);
    expect(actionShadows.every((shadow) => shadow !== 'none')).toBe(true);

    await e2eScreenshotThemes(page, '04');
  });

  test('matches the editor geometry', async ({ page }) => {
    for (const [story, anchorSelector] of [
      [
        'e2e-inlineedit--edit-state',
        '[data-slot="inline-edit-view-container"]',
      ],
      ['e2e-inlineedit--edit-state-without-label', '[data-slot="inline-edit"]'],
    ] as const) {
      await e2eGotoStory(page, story);

      const panel = page.locator('[data-slot="inline-edit-panel"]');
      const input = page.getByRole('textbox', { name: 'Value' });
      await expect(panel).toBeVisible();
      await expect(input).toBeFocused();

      const [panelBox, anchorBox, inputBox] = await Promise.all([
        panel.boundingBox(),
        page.locator(anchorSelector).boundingBox(),
        input.boundingBox(),
      ]);

      expect(panelBox).not.toBeNull();
      expect(anchorBox).not.toBeNull();
      expect(inputBox).not.toBeNull();

      expect(panelBox!.x).toBeCloseTo(anchorBox!.x, 5);
      expect(panelBox!.y).toBeCloseTo(anchorBox!.y, 5);
      expect(panelBox!.width).toBeCloseTo(anchorBox!.width, 5);
      expect(panelBox!.height).toBeCloseTo(inputBox!.height, 5);
    }
  });

  test('does not clip the editor focus ring', async ({ page }) => {
    for (const story of [
      'e2e-inlineedit--edit-state',
      'e2e-inlineedit--edit-state-without-label',
    ]) {
      await e2eGotoStory(page, story);

      const input = page.getByRole('textbox', { name: 'Value' });
      await expect(input).toBeFocused();

      const clippingAncestors = await input.evaluate((element) => {
        const panelElement = document.querySelector(
          '[data-slot="inline-edit-panel"]'
        );

        const result: string[] = [];

        for (
          let current = element.parentElement;
          current && current !== panelElement;
          current = current.parentElement
        ) {
          const style = getComputedStyle(current);

          if (
            style.overflow !== 'visible' ||
            style.overflowX !== 'visible' ||
            style.overflowY !== 'visible'
          ) {
            result.push(
              `${current.getAttribute('data-slot') || current.tagName}: ${style.overflow}`
            );
          }
        }

        return result;
      });

      expect(clippingAncestors).toEqual([]);
    }
  });

  test('closes on outside interaction without reopening or stealing focus', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--outside-interaction');

    const outsideButton = page.getByTestId('outside-button');
    const outsideNonfocusable = page.getByTestId('outside-nonfocusable');
    const saveCount = page.getByTestId('save-count');
    let expectedSaveCount = 0;

    for (const testId of ['controlled', 'uncontrolled']) {
      const root = page.getByTestId(testId);
      const view = root.getByRole('button');

      await view.click();
      await expect(page.getByRole('textbox', { name: 'Value' })).toBeFocused();

      await outsideButton.click();
      expectedSaveCount += 1;

      await expect(root).toHaveAttribute('data-mode', 'view');
      await expect(outsideButton).toBeFocused();
      await expect(saveCount).toHaveText(String(expectedSaveCount));
      await expect(page.getByRole('dialog')).toHaveCount(0);

      await view.click();
      await outsideNonfocusable.click();
      expectedSaveCount += 1;

      await expect(root).toHaveAttribute('data-mode', 'view');
      await expect(saveCount).toHaveText(String(expectedSaveCount));
      await expect(page.getByRole('dialog')).toHaveCount(0);
      await expect(view).toBeFocused();

      await outsideButton.click();
      await expect(saveCount).toHaveText(String(expectedSaveCount));
      await expect(outsideButton).toBeFocused();
    }
  });

  test('saves a real Textarea with Cmd/Ctrl+Enter', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--textarea-interaction');

    const textarea = page.getByRole('textbox', { name: 'Value' });
    await expect(textarea).toBeFocused();

    await textarea.fill('Line 1');
    await textarea.press('Enter');
    await textarea.pressSequentially('Line 2');
    await expect(textarea).toHaveValue('Line 1\nLine 2');

    await textarea.press('Control+Enter');

    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.getByTestId('saved-value')).toHaveText('Line 1\nLine 2');
  });

  test('keeps Textarea width equal to its trigger while typing', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--textarea-interaction');

    const root = page.locator('[data-slot="inline-edit"]');
    const panel = page.locator('[data-slot="inline-edit-panel"]');
    const textarea = page.getByRole('textbox', { name: 'Value' });
    const initialWidth = (await root.boundingBox())!.width;

    expect((await panel.boundingBox())!.width).toBeCloseTo(initialWidth, 5);

    await textarea.fill('W'.repeat(200));

    expect((await root.boundingBox())!.width).toBeCloseTo(initialWidth, 5);
    expect((await panel.boundingBox())!.width).toBeCloseTo(initialWidth, 5);
  });

  test('keeps the Textarea example trigger stable while typing', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--textarea-example-interaction');

    const root = page.locator('[data-slot="inline-edit"]');
    const view = page.locator('[data-slot="inline-edit-view-container"]');
    const initialWidth = (await root.boundingBox())!.width;
    await view.getByRole('button').click();

    const textarea = page.getByRole('textbox', { name: 'Description' });
    const panel = page.locator('[data-slot="inline-edit-panel"]');
    await textarea.fill('W'.repeat(200));

    expect((await root.boundingBox())!.width).toBeCloseTo(initialWidth, 5);

    expect((await panel.boundingBox())!.width).toBeCloseTo(
      await view.evaluate((element) => (element as HTMLElement).offsetWidth),
      5
    );

    await expect(view).toHaveText('Monitors incidents');
  });

  test('stays open and follows the trigger on parent scroll', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--scroll-interaction');

    const root = page.getByTestId('scroll-root');
    const panel = page.locator('[data-slot="inline-edit-panel"]');
    await expect(root).toHaveAttribute('data-mode', 'edit');

    await page
      .getByTestId('scroll-container')
      .evaluate((element) => (element.scrollTop = 60));

    await expect(root).toHaveAttribute('data-mode', 'edit');

    await expect
      .poll(async () => {
        const rootBox = await root.boundingBox();
        const panelBox = await panel.boundingBox();

        return panelBox!.y - rootBox!.y;
      })
      .toBeCloseTo(0, 5);
  });

  test('stays open and follows the trigger on window scroll', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--window-scroll-interaction');

    const root = page.getByTestId('window-scroll-root');
    const panel = page.locator('[data-slot="inline-edit-panel"]');
    await expect(root).toHaveAttribute('data-mode', 'edit');

    await page.evaluate(() => window.scrollTo(0, 80));

    await expect(root).toHaveAttribute('data-mode', 'edit');

    await expect
      .poll(async () => {
        const rootBox = await root.boundingBox();
        const panelBox = await panel.boundingBox();

        return panelBox!.y - rootBox!.y;
      })
      .toBeCloseTo(0, 5);
  });

  test('edits a label-less value inside DescriptionList', async ({ page }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--description-list-interaction');

    const root = page.getByTestId('description-inline-edit');
    await root.getByRole('button').click();

    const panel = page.locator('[data-slot="inline-edit-panel"]');
    const input = page.getByRole('textbox', { name: 'Value' });
    await expect(panel).toBeVisible();
    await expect(input).toBeFocused();

    const rootBox = await root.boundingBox();
    await expect(panel).toHaveCSS('left', `${rootBox!.x}px`);
    await expect(panel).toHaveCSS('top', `${rootBox!.y}px`);
    await expect(panel).toHaveCSS('width', `${rootBox!.width}px`);

    await input.fill('Italy');
    await input.press('Enter');

    await expect(root).toHaveAttribute('data-mode', 'view');
    await expect(root).toHaveText('Italy');
  });

  test('chains Tab into the adjacent InlineEdit with keyboard focus', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--tab-navigation');

    const first = page.getByTestId('tab-first');
    const second = page.getByTestId('tab-second');
    const editor = page.getByRole('textbox', { name: 'Value' }).last();
    await expect(first).toHaveAttribute('data-mode', 'edit');
    await expect(editor).toBeFocused();

    await editor.press('Tab');

    await expect(first).toHaveAttribute('data-mode', 'view');
    await expect(second).toHaveAttribute('data-mode', 'edit');
    await expect(editor).toBeFocused();
    await expect(page.getByTestId('tab-save-count')).toHaveText('1');

    await editor.press('Escape');
    const secondView = second.getByRole('button');
    await expect(secondView).toBeFocused();

    expect(
      await secondView.evaluate((element) => element.matches(':focus-visible'))
    ).toBe(true);
  });

  test('moves Tab to adjacent tab stops and skips disabled or hidden controls', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--tab-navigation');

    const editor = page.getByRole('textbox', { name: 'Value' }).last();
    const second = page.getByTestId('tab-second');
    const third = page.getByTestId('tab-third');
    await editor.press('Tab');
    await expect(second).toHaveAttribute('data-mode', 'edit');
    await expect(editor).toBeFocused();
    await editor.press('Tab');

    await expect(third).toHaveAttribute('data-mode', 'edit');

    await editor.press('Tab');

    await expect(page.getByTestId('tab-after')).toBeFocused();
    await expect(page.getByTestId('tab-save-count')).toHaveText('3');

    await e2eGotoStory(page, 'e2e-inlineedit--tab-navigation');
    await editor.press('Tab');
    await expect(second).toHaveAttribute('data-mode', 'edit');
    await expect(editor).toBeFocused();
    await editor.press('Tab');

    await expect(third).toHaveAttribute('data-mode', 'edit');

    await expect(editor).toBeFocused();
    await editor.press('Shift+Tab');

    await expect(page.getByTestId('tab-second')).toHaveAttribute(
      'data-mode',
      'edit'
    );

    await expect(editor).toBeFocused();
    await editor.press('Shift+Tab');

    await expect(page.getByTestId('tab-first')).toHaveAttribute(
      'data-mode',
      'edit'
    );

    await expect(editor).toBeFocused();
    await editor.press('Shift+Tab');

    await expect(page.getByTestId('tab-before')).toBeFocused();
    await expect(page.getByTestId('tab-save-count')).toHaveText('5');
  });

  test('keeps Tab between middle panel controls and saves at the boundary', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--tab-middle-controls');

    const root = page.getByTestId('tab-middle');
    const first = page.getByRole('textbox', { name: 'First editor' });
    const second = page.getByRole('textbox', { name: 'Second editor' });
    await expect(first).toBeFocused();

    await first.press('Tab');
    await expect(second).toBeFocused();
    await expect(root).toHaveAttribute('data-mode', 'edit');

    await second.press('Tab');
    await expect(root).toHaveAttribute('data-mode', 'view');
    await expect(page.getByTestId('tab-after')).toBeFocused();

    await e2eGotoStory(page, 'e2e-inlineedit--tab-middle-controls');
    await first.press('Shift+Tab');
    await expect(root).toHaveAttribute('data-mode', 'view');
    await expect(page.getByTestId('tab-before')).toBeFocused();
  });

  test('opens a single Select dropdown with the InlineEdit anchor and width', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--select-interaction');

    const root = page.getByTestId('select-root');
    const dropdown = page.locator('[data-slot="dropdown"]');
    await expect(dropdown).toBeVisible();
    await expect(root).toHaveAttribute('data-mode', 'edit');

    await expect(
      page.locator('[data-slot="inline-edit-panel"] [data-slot="form-field"]')
    ).toBeHidden();

    const rootBox = await root.boundingBox();
    const dropdownBox = await dropdown.boundingBox();
    expect(dropdownBox!.x).toBeCloseTo(rootBox!.x, 5);
    expect(dropdownBox!.y).toBeCloseTo(rootBox!.y + rootBox!.height + 4, 5);
    expect(dropdownBox!.width).toBeCloseTo(rootBox!.width, 5);
  });

  test('keeps a multiple multiline Select in the regular editor panel', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--select-multiline-interaction');

    await expect(page.getByTestId('select-multiline-root')).toHaveAttribute(
      'data-mode',
      'edit'
    );

    await expect(page.getByRole('listbox')).toHaveCount(0);

    await expect(
      page.locator('[data-slot="inline-edit-panel"] [data-slot="form-field"]')
    ).toBeVisible();
  });

  test('commits a Select option through the common save path', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--select-interaction');

    await page.getByRole('option', { name: 'DDoS' }).click();

    await expect(page.getByTestId('select-root')).toHaveAttribute(
      'data-mode',
      'view'
    );

    await expect(
      page
        .getByTestId('select-root')
        .locator('[data-slot="inline-edit-view-container"]')
    ).toHaveText('DDoS');

    await expect(page.locator('[data-slot="dropdown"]')).toHaveCount(0);
  });

  test('saves and moves focus when Tab closes the Select dropdown', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--select-interaction');

    await expect(page.locator('[data-slot="dropdown"]')).toBeVisible();
    await page.keyboard.press('Tab');

    await expect(page.getByTestId('select-root')).toHaveAttribute(
      'data-mode',
      'view'
    );

    await expect(page.getByTestId('select-after')).toBeFocused();
  });

  test('scrolls an invalid editor into view before showing its tooltip', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--validation-interaction');

    const root = page.getByTestId('validation-root');
    const input = page.getByRole('textbox', { name: 'Required name editor' });
    const container = page.getByTestId('validation-scroll-container');
    await expect(input).toBeFocused();

    await container.evaluate((element) => (element.scrollTop = 0));
    await page.keyboard.press('Enter');

    const tooltip = page.getByRole('tooltip');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toHaveText('Name is required');
    await expect(tooltip).toHaveAttribute('data-placement', /^top/);
    await expect(input).toHaveAttribute('aria-invalid', 'true');

    expect(
      await container.evaluate((element) => element.scrollTop)
    ).toBeGreaterThan(0);

    await expect(root).toHaveAttribute('data-mode', 'edit');

    await input.fill('Valid name');
    await expect(tooltip).toHaveCount(0);
    await input.press('Enter');
    await expect(root).toHaveAttribute('data-mode', 'view');
    await expect(root).toHaveText('Valid name');
  });

  test('shows striped progress over the trigger', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await e2eGotoStory(page, 'e2e-inlineedit--save-progress-interaction');

    const root = page.getByTestId('async-progress-root');
    const input = page.getByRole('textbox', { name: 'Value' });
    await input.fill('Platform');
    await input.press('Enter');

    await expect(root).toHaveAttribute('data-save-status', 'progress');

    const progress = await root.evaluate((element) => {
      const style = getComputedStyle(element, '::after');

      return {
        backgroundImage: style.backgroundImage,
        animationName: style.animationName,
      };
    });

    expect(progress.backgroundImage).toContain('linear-gradient');
    expect(progress.animationName).toContain('inline-edit-progress');
  });

  test('marks a rejected value red without rendering inline error controls', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--save-error-interaction');

    const root = page.getByTestId('async-error-root');
    const input = page.getByRole('textbox', { name: 'Value' });
    await input.fill('Platform');
    await input.press('Enter');

    await expect(root).toHaveAttribute('data-save-status', 'error');

    expect(
      await root.evaluate((element) => {
        const probe = document.createElement('div');
        probe.style.backgroundColor = 'var(--kbq-background-error-less)';
        document.body.append(probe);
        const expected = getComputedStyle(probe).backgroundColor;
        probe.remove();

        return getComputedStyle(element).backgroundColor === expected;
      })
    ).toBe(true);

    await expect(
      page.locator('[data-slot="inline-edit-save-error"]')
    ).toHaveCount(0);
  });

  test('provides response-time controls and external save-error actions', async ({
    page,
  }) => {
    await e2eGotoStory(
      page,
      'e2e-inlineedit--save-progress-example-interaction'
    );

    await expect(page.getByText('Server response time')).toBeVisible();
    const slowestResponse = page.getByRole('radio', { name: '3000 ms' });
    await slowestResponse.click();
    await expect(slowestResponse).toHaveAttribute('data-selected', 'true');

    await e2eGotoStory(page, 'e2e-inlineedit--save-error-example-interaction');

    await page
      .locator('[data-slot="inline-edit-view-container"]')
      .getByRole('button')
      .click();

    const input = page.getByRole('textbox', { name: 'Name' });
    await input.fill('Platform');
    await input.press('Enter');

    const notification = page
      .getByRole('alert')
      .filter({ hasText: "Couldn't update Name" });

    await expect(
      notification.getByRole('button', { name: 'Retry' })
    ).toBeVisible();

    await expect(
      notification.getByRole('button', { name: 'Edit' })
    ).toBeVisible();

    await expect(
      notification.getByRole('button', { name: 'Rollback' })
    ).toBeVisible();

    await expect(
      page.locator('[data-slot="inline-edit-save-error"]')
    ).toHaveCount(0);
  });

  test('keeps an open action menu visible without enabling a disabled editor', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--menu-interaction');

    const root = page.getByTestId('menu-root');
    const mask = page.locator('[data-slot="inline-edit-menu"]');
    await root.hover();
    await expect(mask).toHaveCSS('opacity', '1');
    await expect(mask).toHaveCSS('overflow', 'hidden');

    const [rootRadius, maskRadius] = await Promise.all([
      root.evaluate((element) => getComputedStyle(element).borderRadius),
      mask.evaluate((element) => getComputedStyle(element).borderRadius),
    ]);

    expect(maskRadius).toBe(rootRadius);

    await expect(
      page.getByRole('button', { name: 'Open value actions' })
    ).toHaveAttribute('data-variant', 'fade-contrast');

    await page.getByRole('button', { name: 'Open value actions' }).click();
    await expect(page.getByRole('menu')).toBeVisible();
    await page.mouse.move(0, 0);
    await expect(mask).toHaveCSS('opacity', '1');

    await page.getByRole('menuitem', { name: 'Duplicate' }).click();
    await expect(page.getByTestId('menu-action')).toHaveText('duplicate');
    await expect(root).toHaveAttribute('data-mode', 'view');
    await expect(root).toHaveAttribute('data-disabled', 'true');
  });

  test('keeps interactive view actions and dynamic content accessible', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--interactive-view-interaction');

    const root = page.getByTestId('interactive-root');
    await expect(root).toHaveAttribute('data-interactive', 'true');

    await page.getByRole('link', { name: 'Security team' }).click();
    await expect(root).toHaveAttribute('data-mode', 'view');
    await expect(page.getByRole('textbox')).toHaveCount(0);

    await page.getByRole('button', { name: 'Remove' }).click();
    await expect(root).toHaveAttribute('data-mode', 'view');

    const anchor = root.locator('[data-slot="inline-edit-focus-anchor"]');
    await anchor.focus();
    await page.keyboard.press('Enter');
    await expect(root).toHaveAttribute('data-mode', 'edit');
    await page.keyboard.press('Escape');

    const restoredAnchor = root.locator(
      '[data-slot="inline-edit-focus-anchor"]'
    );

    await expect(restoredAnchor).toBeFocused();

    expect(
      await restoredAnchor.evaluate((element) =>
        element.matches(':focus-visible')
      )
    ).toBe(true);

    const dynamicRoot = page.getByTestId('dynamic-interactive-root');

    await expect(
      dynamicRoot.locator('[data-slot="inline-edit-focus-anchor"]')
    ).toHaveCount(0);

    await page.getByRole('button', { name: 'Add dynamic link' }).click();

    await expect(
      dynamicRoot.locator('[data-slot="inline-edit-focus-anchor"]')
    ).toHaveCount(1);
  });

  test('resolves the default and root-level control shadow', async ({
    page,
  }) => {
    await e2eGotoStory(page, 'e2e-inlineedit--edit-state');

    const defaultControl = page.locator('[data-slot="inline-edit-control"]');
    await expect(defaultControl).toBeVisible();

    const defaultShadow = await defaultControl.evaluate(
      (element) => getComputedStyle(element).boxShadow
    );

    expect(defaultShadow).not.toBe('none');

    await e2eGotoStory(page, 'e2e-inlineedit--view-states');
    const root = page.locator('[data-slot="inline-edit"]').first();

    await root.evaluate((element) => {
      element.style.setProperty(
        '--kbq-inline-edit-panel-shadow',
        '0 4px 8px rgb(1, 2, 3)'
      );
    });

    await root.getByRole('button', { name: 'Edit' }).click();

    const overriddenControl = page.locator('[data-slot="inline-edit-control"]');
    await expect(overriddenControl).toBeVisible();

    await expect
      .poll(() =>
        overriddenControl.evaluate(
          (element) => getComputedStyle(element).boxShadow
        )
      )
      .toContain('rgb(1, 2, 3)');
  });
});
