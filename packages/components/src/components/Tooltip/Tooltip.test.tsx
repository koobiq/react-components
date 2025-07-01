import { createRef } from 'react';

import { act, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

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

    render(<Tooltip {...baseProps} ref={ref} open />);

    expect(ref.current).toBe(getRoot());
  });

  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';

    render(<Tooltip {...baseProps} className={className} open />);

    const root = getRoot();
    expect(root?.className).toContain(className);
    expect(root?.className).toContain(s.base);
  });

  describe('check the variant prop', () => {
    it.each(tooltipPropVariant)(
      'should apply the size as a "%s"',
      (variant) => {
        render(<Tooltip {...baseProps} variant={variant} open />);

        expect(getRoot()).toHaveAttribute('data-variant', variant);
      }
    );
  });

  test('check the hideArrow prop', () => {
    const { rerender } = render(<Tooltip {...baseProps} open />);

    expect(getRoot()).toHaveAttribute('data-arrow', 'true');

    rerender(<Tooltip {...baseProps} hideArrow open />);

    expect(getRoot()).toHaveAttribute('data-arrow', 'false');
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
    it('should open the component when the control is focused', async () => {
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
          control={() => <IconButton data-testid="control"></IconButton>}
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
