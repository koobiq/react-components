import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

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
});
