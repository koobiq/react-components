import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useElementOverflow } from './useElementOverflow';

const TEST_ID = 'element';

const setDimensions = (
  element: HTMLElement,
  dimensions: {
    clientWidth: number;
    scrollWidth: number;
    clientHeight: number;
    scrollHeight: number;
  }
) => {
  for (const [property, value] of Object.entries(dimensions)) {
    Object.defineProperty(element, property, { configurable: true, value });
  }
};

const createResizeEntry = (): ResizeObserverEntry =>
  ({
    contentRect: {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 100,
      bottom: 40,
      width: 100,
      height: 40,
    },
    borderBoxSize: [{ inlineSize: 100, blockSize: 40 }],
  }) as unknown as ResizeObserverEntry;

function TestElement() {
  const { ref, isOverflow, isOverflowX, isOverflowY } =
    useElementOverflow<HTMLDivElement>();

  return (
    <div
      ref={ref}
      data-testid={TEST_ID}
      data-overflowing={isOverflow || undefined}
      data-overflowing-x={isOverflowX || undefined}
      data-overflowing-y={isOverflowY || undefined}
    />
  );
}

describe('useElementOverflow', () => {
  let resize: ResizeObserverCallback;
  const observe = vi.fn();
  const disconnect = vi.fn();

  beforeEach(() => {
    class ResizeObserverMock {
      constructor(callback: ResizeObserverCallback) {
        resize = callback;
      }

      observe = observe;
      disconnect = disconnect;
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
    vi.clearAllMocks();
  });

  it('detects horizontal and vertical overflow', () => {
    const { rerender } = render(<TestElement />);
    const element = screen.getByTestId(TEST_ID);

    setDimensions(element, {
      clientWidth: 100,
      scrollWidth: 101,
      clientHeight: 40,
      scrollHeight: 40,
    });

    rerender(<TestElement />);

    expect(element).toHaveAttribute('data-overflowing');
    expect(element).toHaveAttribute('data-overflowing-x');
    expect(element).not.toHaveAttribute('data-overflowing-y');

    setDimensions(element, {
      clientWidth: 100,
      scrollWidth: 100,
      clientHeight: 40,
      scrollHeight: 41,
    });

    act(() => resize([createResizeEntry()], {} as ResizeObserver));

    expect(element).toHaveAttribute('data-overflowing');
    expect(element).not.toHaveAttribute('data-overflowing-x');
    expect(element).toHaveAttribute('data-overflowing-y');
  });

  it('updates when the content fits and disconnects the observer', () => {
    const { rerender, unmount } = render(<TestElement />);
    const element = screen.getByTestId(TEST_ID);

    setDimensions(element, {
      clientWidth: 100,
      scrollWidth: 120,
      clientHeight: 40,
      scrollHeight: 40,
    });

    rerender(<TestElement />);

    expect(element).toHaveAttribute('data-overflowing');

    setDimensions(element, {
      clientWidth: 100,
      scrollWidth: 100,
      clientHeight: 40,
      scrollHeight: 40,
    });

    act(() => resize([createResizeEntry()], {} as ResizeObserver));

    expect(element).not.toHaveAttribute('data-overflowing');
    expect(element).not.toHaveAttribute('data-overflowing-x');
    expect(element).not.toHaveAttribute('data-overflowing-y');

    unmount();
    expect(disconnect).toHaveBeenCalled();
  });
});
