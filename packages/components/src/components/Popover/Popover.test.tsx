import { createRef } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Button } from '../Button';

import { Popover, popoverPropSize } from './index';

describe('Popover', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const onOpenChange = vi.fn();

  const baseProps = { 'data-testid': 'root', onOpenChange };

  const getRoot = () => screen.getByTestId('root');

  it('should forward a ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Popover {...baseProps} ref={ref} isOpen />);

    expect(ref.current).toBe(getRoot());
  });

  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';

    render(<Popover {...baseProps} className={className} isOpen />);

    const root = getRoot();
    expect(root?.className).toContain(className);
  });

  it('should set custom style', () => {
    const style = { padding: 20 };

    render(<Popover {...baseProps} style={style} isOpen />);

    const root = getRoot();

    expect(root).toHaveStyle({ padding: '20px' });
  });

  describe('check the size prop', () => {
    it.each(popoverPropSize)('should apply the size as a "%s"', (size) => {
      render(<Popover {...baseProps} size={size} isOpen />);

      expect(getRoot()).toHaveAttribute('data-size', size);
    });
  });

  it('check the hideArrow prop', () => {
    const { rerender } = render(<Popover {...baseProps} isOpen />);

    expect(getRoot()).toHaveAttribute('data-arrow', 'true');

    rerender(<Popover {...baseProps} hideArrow isOpen />);

    expect(getRoot()).not.toHaveAttribute('data-arrow');
  });

  it('should align the arrow for a compound placement', async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
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
      }
    );

    const { rerender } = render(
      <Popover
        {...baseProps}
        isOpen
        placement="top start"
        control={(props) => <Button {...props} />}
      />
    );

    await waitFor(() => {
      expect(getRoot().querySelector('[role="presentation"]')).toHaveStyle({
        left: '20px',
      });
    });

    rerender(
      <Popover
        {...baseProps}
        isOpen
        placement="top start"
        arrowBoundaryOffset={24}
        control={(props) => <Button {...props} />}
      />
    );

    await waitFor(() => {
      expect(getRoot().querySelector('[role="presentation"]')).toHaveStyle({
        left: '24px',
      });
    });
  });

  it('should keep arrow slot styles as the highest priority', async () => {
    render(
      <Popover
        {...baseProps}
        isOpen
        placement="top start"
        slotProps={{ arrow: { style: { left: 32 } } }}
        control={(props) => <Button {...props} />}
      />
    );

    await waitFor(() => {
      expect(getRoot().querySelector('[role="presentation"]')).toHaveStyle({
        left: '32px',
      });
    });
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
    const { rerender } = render(<Popover {...baseProps} isOpen={false} />);

    await userEvent.click(document.body);

    rerender(
      <>
        <button data-testid="button" />
        <Popover {...baseProps} isOpen />
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
