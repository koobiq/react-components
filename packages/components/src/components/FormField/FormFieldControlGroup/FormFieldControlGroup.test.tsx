import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import addonStyles from '../FormFieldAddon/FormFieldAddon.module.css';

import s from './FormFieldControlGroup.module.css';
import { FormFieldControlGroup } from './index';

describe('FormFieldControlGroup', () => {
  const getRoot = () => screen.getByTestId('root');
  const getInput = () => screen.getByTestId('input');

  it('should pass focusProps to the children render function', async () => {
    render(
      <FormFieldControlGroup data-testid="root">
        {({ focusProps }) => (
          <div data-testid="input-wrapper">
            <input data-testid="input" {...focusProps} />
          </div>
        )}
      </FormFieldControlGroup>
    );

    expect(screen.getByTestId('input-wrapper')).toContainElement(getInput());

    await userEvent.click(getInput());

    await waitFor(() => {
      expect(getRoot()).toHaveClass(s.focused);
    });
  });

  it('should mark the group and its addons as read-only', () => {
    render(
      <FormFieldControlGroup
        data-testid="root"
        isReadOnly
        startAddon={<span>start</span>}
        endAddon={<span>end</span>}
      >
        <input data-testid="input" />
      </FormFieldControlGroup>
    );

    expect(getRoot()).toHaveAttribute('data-readonly', 'true');

    ['start', 'end'].forEach((placement) => {
      const addon = screen.getByTestId(`field-addon-${placement}`);

      expect(addon).toHaveAttribute('data-readonly', 'true');
      expect(addon).toHaveClass(addonStyles.readonly);
    });
  });

  it('should not mark addons as read-only by default', () => {
    render(
      <FormFieldControlGroup data-testid="root" endAddon={<span>end</span>}>
        <input data-testid="input" />
      </FormFieldControlGroup>
    );

    expect(getRoot()).not.toHaveAttribute('data-readonly');

    expect(screen.getByTestId('field-addon-end')).not.toHaveAttribute(
      'data-readonly'
    );
  });
});
