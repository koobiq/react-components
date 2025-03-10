import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from './Modal';
import s from './Modal.module.css';
import { type ModalProps, modalPropSize } from './types';

describe('Modal', () => {
  const baseProps: ModalProps = {
    'data-testid': 'root',
    slotProps: {
      dialog: {
        'data-testid': 'dialog',
      },
    },
  };

  const getRoot = () => screen.getByTestId('root');
  const getDialog = () => screen.getByTestId('dialog');
  const getBackdrop = () => screen.getByTestId('backdrop');
  const getCloseButton = () => screen.getByTestId('close-button');

  it('should forward a ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Modal {...baseProps} ref={ref} open />);

    expect(ref.current).toBe(getRoot());
  });

  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';

    render(<Modal {...baseProps} className={className} open />);

    const root = getRoot();
    expect(root?.className).toContain(className);
  });

  describe('check the size prop', () => {
    it.each(modalPropSize)('should apply the size as a "%s"', (size) => {
      render(<Modal {...baseProps} size={size} open />);

      expect(getRoot()).toHaveAttribute('data-size', size);
    });
  });

  describe('check slots', () => {
    const dialogRef = createRef<HTMLDivElement>();
    const backdropRef = createRef<HTMLDivElement>();

    describe('dialog', () => {
      it('should merge a custom props with the default ones', () => {
        render(
          <Modal
            slotProps={{
              dialog: {
                'data-testid': 'dialog',
                className: 'foo',
                ref: dialogRef,
              },
            }}
            defaultOpen
          />
        );

        const dialog = getDialog();
        expect(dialog).toHaveClass(s.dialog);
        expect(dialog).toHaveClass('foo');
        expect(dialogRef.current).toBe(dialog);
      });
    });

    describe('backdrop', () => {
      it('should merge a custom props with the default ones', () => {
        render(
          <Modal
            slotProps={{
              backdrop: {
                'data-testid': 'backdrop',
                className: 'bar',
                ref: backdropRef,
              },
            }}
            defaultOpen
          />
        );

        const backdrop = getBackdrop();
        expect(backdrop).toHaveClass('bar');
        expect(backdropRef.current).toBe(backdrop);
      });
    });
  });

  describe('close button', () => {
    test('check the hideCloseButton prop', () => {
      const { rerender } = render(<Modal {...baseProps} open />);

      expect(getDialog()).toHaveAttribute('data-close-button', 'true');

      rerender(<Modal {...baseProps} hideCloseButton open />);

      expect(getDialog()).toHaveAttribute('data-close-button', 'false');
    });

    test('should call the onOpenChange handler when clicked', async () => {
      const onOpenChange = vi.fn();
      const onClick = vi.fn();

      render(
        <Modal
          {...baseProps}
          slotProps={{
            dialog: {
              slotProps: {
                'close-button': {
                  'data-testid': 'close-button',
                  onClick,
                },
              },
            },
          }}
          onOpenChange={onOpenChange}
          defaultOpen
        />
      );

      const closeButton = getCloseButton();

      await userEvent.click(closeButton);

      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
