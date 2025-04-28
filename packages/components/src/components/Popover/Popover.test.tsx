import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../Button';

import { Popover, popoverPropSize } from './index';

describe('Popover', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const onOpenChange = vi.fn();

  const baseProps = { 'data-testid': 'root', onOpenChange };

  const getRoot = () => screen.getByTestId('root');

  it('should forward a ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Popover {...baseProps} ref={ref} open />);

    expect(ref.current).toBe(getRoot());
  });

  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';

    render(<Popover {...baseProps} className={className} open />);

    const root = getRoot();
    expect(root?.className).toContain(className);
  });

  describe('check the size prop', () => {
    it.each(popoverPropSize)('should apply the size as a "%s"', (size) => {
      render(<Popover {...baseProps} size={size} open />);

      expect(getRoot()).toHaveAttribute('data-size', size);
    });
  });

  test('check the hideArrow prop', () => {
    const { rerender } = render(<Popover {...baseProps} open />);

    expect(getRoot()).toHaveAttribute('data-arrow', 'true');

    rerender(<Popover {...baseProps} hideArrow open />);

    expect(getRoot()).toHaveAttribute('data-arrow', 'false');
  });

  it('should apply the focus trap', async () => {
    render(
      <>
        <button />
        <Popover defaultOpen>
          <input data-testid="input" />
        </Popover>
      </>
    );

    await userEvent.tab();
    await userEvent.tab();

    expect(screen.getByTestId('input')).toHaveFocus();
  });

  it('should call the {onOpenChange} callback when the click outside is completed', async () => {
    const { rerender } = render(<Popover {...baseProps} open={false} />);

    await userEvent.click(document.body);

    rerender(
      <>
        <button data-testid="button" />
        <Popover {...baseProps} open />
      </>
    );

    await userEvent.click(screen.getByTestId('button'));

    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  describe('control', () => {
    it('should open the component when the control is clicked', async () => {
      const onOpenChange = vi.fn((value) => value);

      render(
        <Popover
          {...baseProps}
          onOpenChange={onOpenChange}
          control={(props) => <Button data-testid="control" {...props} />}
        />
      );

      await userEvent.click(screen.getByTestId('control'));

      expect(onOpenChange).toHaveBeenCalledTimes(1);

      expect(onOpenChange.mock.results[0]?.value).toStrictEqual(true);
    });
  });

  describe('content', () => {
    it('should display the content as the string', () => {
      render(
        <Popover {...baseProps} defaultOpen>
          foo
        </Popover>
      );

      expect(screen.getByText('foo')).toBeInTheDocument();
    });

    it('should display the content as the render function', () => {
      render(
        <Popover {...baseProps} defaultOpen>
          {() => <>foo</>}
        </Popover>
      );

      expect(screen.getByText('foo')).toBeInTheDocument();
    });

    it('should close the component when the {close} is fired', async () => {
      const onOpenChange = vi.fn((value) => value);

      render(
        <Popover {...baseProps} onOpenChange={onOpenChange} defaultOpen>
          {({ close }) => <button onClick={close} data-testid="close" />}
        </Popover>
      );

      await userEvent.click(screen.getByTestId('close'));

      expect(onOpenChange).toHaveBeenCalledTimes(1);

      expect(onOpenChange.mock.results[0]?.value).toStrictEqual(false);
    });
  });
});
