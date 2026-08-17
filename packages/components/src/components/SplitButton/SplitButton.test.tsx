import { createRef } from 'react';

import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Button } from '../Button';
import { Menu } from '../Menu';

import { SplitButton, splitButtonPropVariant } from './index.js';

const createResizeEntry = (width: number): ResizeObserverEntry =>
  ({
    contentRect: {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: width,
      bottom: 32,
      width,
      height: 32,
    },
    borderBoxSize: [{ inlineSize: width, blockSize: 32 }],
  }) as unknown as ResizeObserverEntry;

describe('SplitButton', () => {
  let observers: { target: Element; callback: ResizeObserverCallback }[];

  beforeEach(() => {
    observers = [];

    class ResizeObserverMock {
      callback: ResizeObserverCallback;

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }

      observe = (target: Element) => {
        observers.push({ target, callback: this.callback });
      };

      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);

      return 1;
    });

    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const baseProps = { 'data-testid': 'root' };

  const getRoot = () => screen.getByTestId<HTMLDivElement>('root');

  const resizeRoot = (width: number) => {
    const root = getRoot();
    const observer = observers.find((entry) => entry.target === root);

    act(() =>
      observer?.callback([createResizeEntry(width)], {} as ResizeObserver)
    );
  };

  const menu = (props: Record<string, unknown> = {}) => (
    <Menu
      data-testid="menu"
      control={(controlProps) => (
        <Button {...controlProps} aria-label="More options" />
      )}
      {...props}
    >
      <Menu.Item key="import">Import</Menu.Item>
    </Menu>
  );

  it('should receive a ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <SplitButton {...baseProps} ref={ref}>
        <Button>Split Button</Button>
        {menu()}
      </SplitButton>
    );

    expect(ref.current).toBe(getRoot());
  });

  it('should render the component with the correct tag', () => {
    render(
      <SplitButton {...baseProps} as="section">
        <Button>Split Button</Button>
        {menu()}
      </SplitButton>
    );

    expect(getRoot().tagName).toBe('SECTION');
  });

  it('should apply a custom class name', () => {
    render(
      <SplitButton {...baseProps} className="custom">
        <Button>Split Button</Button>
        {menu()}
      </SplitButton>
    );

    expect(getRoot()).toHaveClass('custom');
  });

  describe('check the variant prop', () => {
    it("should default to the 'fade-contrast-filled' variant", () => {
      render(
        <SplitButton {...baseProps}>
          <Button>Split Button</Button>
          {menu()}
        </SplitButton>
      );

      expect(getRoot()).toHaveAttribute('data-variant', 'fade-contrast-filled');

      screen.getAllByRole('button').forEach((button) => {
        expect(button).toHaveAttribute('data-variant', 'fade-contrast-filled');
      });
    });

    it.each(splitButtonPropVariant)(
      'should pass the "%s" variant to both nested buttons',
      (variant) => {
        render(
          <SplitButton {...baseProps} variant={variant}>
            <Button>Split Button</Button>
            {menu()}
          </SplitButton>
        );

        screen.getAllByRole('button').forEach((button) => {
          expect(button).toHaveAttribute('data-variant', variant);
        });
      }
    );
  });

  describe('check the isDisabled prop', () => {
    it('should be enabled by default', () => {
      render(
        <SplitButton {...baseProps}>
          <Button>Split Button</Button>
          {menu()}
        </SplitButton>
      );

      expect(getRoot()).not.toHaveAttribute('data-disabled');
    });

    it('should disable both nested buttons', () => {
      render(
        <SplitButton {...baseProps} isDisabled>
          <Button>Split Button</Button>
          {menu()}
        </SplitButton>
      );

      expect(getRoot()).toHaveAttribute('data-disabled', 'true');

      screen.getAllByRole('button').forEach((button) => {
        expect(button).toBeDisabled();
      });
    });

    it('should disable a single button while the split button stays enabled', () => {
      render(
        <SplitButton {...baseProps}>
          <Button>Split Button</Button>
          {menu({
            control: (controlProps: Record<string, unknown>) => (
              <Button {...controlProps} isDisabled aria-label="More options" />
            ),
          })}
        </SplitButton>
      );

      const [primary, trigger] = screen.getAllByRole('button');

      expect(primary).not.toBeDisabled();
      expect(trigger).toBeDisabled();
    });
  });

  describe('check the isLoading prop', () => {
    it('should not be in progress by default', () => {
      render(
        <SplitButton {...baseProps}>
          <Button>Split Button</Button>
          {menu()}
        </SplitButton>
      );

      expect(getRoot()).not.toHaveAttribute('data-loading');

      screen.getAllByRole('button').forEach((button) => {
        expect(button).not.toHaveAttribute('data-loading');
      });
    });

    it('should show a loader on both the primary button and the menu trigger button', () => {
      render(
        <SplitButton {...baseProps} isLoading>
          <Button>Split Button</Button>
          {menu()}
        </SplitButton>
      );

      expect(getRoot()).toHaveAttribute('data-loading', 'true');

      const [primary, trigger] = screen.getAllByRole('button');

      expect(primary).toHaveAttribute('data-loading', 'true');
      expect(primary).toHaveAttribute('aria-disabled', 'true');
      expect(trigger).toHaveAttribute('data-loading', 'true');
      expect(trigger).toHaveAttribute('aria-disabled', 'true');
    });

    it('should show a loader on a single button while the split button stays idle', () => {
      render(
        <SplitButton {...baseProps}>
          <Button isLoading>Split Button</Button>
          {menu()}
        </SplitButton>
      );

      const [primary, trigger] = screen.getAllByRole('button');

      expect(primary).toHaveAttribute('data-loading', 'true');
      expect(trigger).not.toHaveAttribute('data-loading');
    });
  });

  describe('check the panelAutoWidth prop', () => {
    it("should leave the menu's own size untouched by default", () => {
      render(
        <SplitButton {...baseProps}>
          <Button>Split Button</Button>
          {menu({ isOpen: true })}
        </SplitButton>
      );

      resizeRoot(240);

      expect(screen.getByTestId('menu')).toHaveStyle({
        '--popover-inline-size': 'auto',
      });
    });

    it("should match the menu's width to the split button's measured width", () => {
      render(
        <SplitButton {...baseProps} panelAutoWidth>
          <Button>Split Button</Button>
          {menu({ isOpen: true })}
        </SplitButton>
      );

      resizeRoot(240);

      expect(screen.getByTestId('menu')).toHaveStyle({
        '--popover-inline-size': '240px',
      });
    });

    it("should not override the menu's own explicit popover size", () => {
      render(
        <SplitButton {...baseProps} panelAutoWidth>
          <Button>Split Button</Button>
          {menu({ isOpen: true, slotProps: { popover: { size: '999px' } } })}
        </SplitButton>
      );

      resizeRoot(240);

      expect(screen.getByTestId('menu')).toHaveStyle({
        '--popover-inline-size': '999px',
      });
    });

    it("should remove the menu's own 200px min-inline-size floor so a narrower measured width actually takes effect", () => {
      render(
        <SplitButton {...baseProps} panelAutoWidth>
          <Button>Split Button</Button>
          {menu({ isOpen: true })}
        </SplitButton>
      );

      resizeRoot(120);

      expect(screen.getByTestId('menu')).toHaveStyle({
        '--popover-inline-size': '120px',
        'min-inline-size': '0',
      });
    });

    it('should not remount the menu when the width first measures in', () => {
      render(
        <SplitButton {...baseProps} panelAutoWidth>
          <Button>Split Button</Button>
          {menu({ isOpen: true })}
        </SplitButton>
      );

      const menuBeforeResize = screen.getByTestId('menu');

      resizeRoot(240);

      expect(screen.getByTestId('menu')).toBe(menuBeforeResize);

      expect(screen.getByTestId('menu')).toHaveStyle({
        '--popover-inline-size': '240px',
      });
    });
  });
});
