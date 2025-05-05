import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Dialog } from './Dialog';
import { type DialogProps } from './types';

describe('Dialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseProps: DialogProps = {
    'data-testid': 'dialog',
  };

  const getDialog = () => screen.getByTestId('dialog');

  const getBody = () => screen.getByTestId('body');

  const getCloseButton = () => screen.getByTestId('close-button');

  it('should forward a ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Dialog {...baseProps} ref={ref} />);

    expect(ref.current).toBe(getDialog());
  });

  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';

    render(<Dialog {...baseProps} className={className} />);

    const root = getDialog();
    expect(root?.className).toContain(className);
  });

  describe('check close button', () => {
    it('should call {onClose} when the close button is clicked', async () => {
      const onClose = vi.fn();
      const onPress = vi.fn();

      render(
        <Dialog
          {...baseProps}
          onClose={onClose}
          slotProps={{
            'close-button': { onPress, 'data-testid': 'close-button' },
          }}
        />
      );

      await userEvent.click(getCloseButton());

      expect(onClose).toHaveBeenCalledTimes(1);
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('check body', () => {
    it('should forward a ref', async () => {
      const ref = createRef<HTMLDivElement>();

      render(
        <Dialog {...baseProps}>
          <Dialog.Body ref={ref} data-testid="body" />
        </Dialog>
      );

      expect(ref.current).toBe(getBody());
    });
  });
});
