import { createRef } from 'react';

import { act, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { IconButton } from '../IconButton';

import { Tooltip, tooltipPropVariant } from './index';
import s from './Tooltip.module.css';

describe('Tooltip', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const onOpenChange = vi.fn();

  const baseProps = { 'data-testid': 'root', onOpenChange };

  const getRoot = () => screen.getByTestId('root');

  const user = userEvent.setup({ delay: 0 });

  it('should forward a ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Tooltip {...baseProps} ref={ref} isOpen />);

    expect(ref.current).toBe(getRoot());
  });

  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';

    render(<Tooltip {...baseProps} className={className} isOpen />);

    const root = getRoot();
    expect(root?.className).toContain(className);
    expect(root?.className).toContain(s.base);
  });

  it('should set a custom style', () => {
    const style = { padding: 20 };

    render(<Tooltip {...baseProps} style={style} isOpen />);

    expect(getRoot()).toHaveStyle({ padding: '20px' });
  });

  describe('check the variant prop', () => {
    it.each(tooltipPropVariant)(
      'should apply the size as a "%s"',
      (variant) => {
        render(<Tooltip {...baseProps} variant={variant} isOpen />);

        expect(getRoot()).toHaveAttribute('data-variant', variant);
      }
    );
  });

  it('check the hideArrow prop', () => {
    const { rerender } = render(<Tooltip {...baseProps} isOpen />);

    expect(getRoot()).not.toHaveAttribute('data-arrow');

    rerender(<Tooltip {...baseProps} hideArrow={false} isOpen />);

    expect(getRoot()).toHaveAttribute('data-arrow', 'true');
  });

  it('should align the arrow for a compound placement', async () => {
    const getBoundingClientRect = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(function (this: HTMLElement) {
        if (this.dataset.testid === 'root') {
          return {
            bottom: 64,
            height: 64,
            left: 0,
            right: 200,
            top: 0,
            width: 200,
            x: 0,
            y: 0,
          } as DOMRect;
        }

        if (this.tagName === 'BUTTON') {
          return {
            bottom: 32,
            height: 32,
            left: 0,
            right: 100,
            top: 0,
            width: 100,
            x: 0,
            y: 0,
          } as DOMRect;
        }

        return {
          bottom: 0,
          height: 0,
          left: 0,
          right: 0,
          top: 0,
          width: 0,
          x: 0,
          y: 0,
        } as DOMRect;
      });

    const { rerender } = render(
      <Tooltip
        {...baseProps}
        isOpen
        hideArrow={false}
        placement="top start"
        control={(props) => <button {...props} />}
      />
    );

    await waitFor(() => {
      expect(getRoot().querySelector('[role="presentation"]')).toHaveStyle({
        left: '16px',
      });
    });

    rerender(
      <Tooltip
        {...baseProps}
        isOpen
        hideArrow={false}
        placement="top start"
        arrowBoundaryOffset={24}
        control={(props) => <button {...props} />}
      />
    );

    await waitFor(() => {
      expect(getRoot().querySelector('[role="presentation"]')).toHaveStyle({
        left: '24px',
      });
    });

    getBoundingClientRect.mockRestore();
  });

  it('should apply the focus trap', async () => {
    render(
      <>
        <button />
        <Tooltip defaultOpen>
          <input data-testid="input" />
        </Tooltip>
      </>
    );

    await user.tab();
    await user.tab();

    expect(screen.getByTestId('input')).toHaveFocus();
  });

  describe('control', () => {
    it('should isOpen the component when the control is focused', async () => {
      const onOpenChange = vi.fn((value) => value);

      render(
        <Tooltip
          {...baseProps}
          trigger="focus"
          onOpenChange={onOpenChange}
          control={(props) => <button data-testid="control" {...props} />}
        >
          foo
        </Tooltip>
      );

      act(() => {
        screen.getByTestId('control').focus();
      });

      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(screen.getByText('foo')).toBeVisible();
      expect(onOpenChange).toBeCalledWith(true);
    });

    it('should display tooltip on focus when Koobiq Button is used as control', async () => {
      const onOpenChange = vi.fn((value) => value);

      render(
        <Tooltip
          {...baseProps}
          trigger="focus"
          onOpenChange={onOpenChange}
          control={(props) => (
            <IconButton data-testid="control" {...props}></IconButton>
          )}
        >
          foo
        </Tooltip>
      );

      await user.tab();

      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(screen.getByText('foo')).toBeVisible();
      expect(onOpenChange).toBeCalledWith(true);
    });
  });

  describe('content', () => {
    it('should display the content as the string', () => {
      render(
        <Tooltip {...baseProps} defaultOpen>
          foo
        </Tooltip>
      );

      expect(screen.getByText('foo')).toBeInTheDocument();
    });
  });
});
