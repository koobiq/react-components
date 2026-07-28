import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useMiddleEllipsis } from './useMiddleEllipsis';

const TEST_ID = 'element';

const createResizeEntry = (width: number): ResizeObserverEntry =>
  ({
    contentRect: {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: width,
      bottom: 20,
      width,
      height: 20,
    },
    borderBoxSize: [{ inlineSize: width, blockSize: 20 }],
  }) as unknown as ResizeObserverEntry;

function TestElement({ value }: { value: string }) {
  const { ref, text, isOverflow } = useMiddleEllipsis<HTMLSpanElement>(value);

  return (
    <span
      ref={ref}
      data-testid={TEST_ID}
      data-overflowing={isOverflow || undefined}
    >
      {text}
    </span>
  );
}

describe('useMiddleEllipsis', () => {
  let resize: ResizeObserverCallback;

  beforeEach(() => {
    class ResizeObserverMock {
      constructor(callback: ResizeObserverCallback) {
        resize = callback;
      }

      observe = vi.fn();
      disconnect = vi.fn();
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);

      return 1;
    });

    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      font: '',
      measureText: (value: string) => ({ width: value.length * 8 }),
    } as CanvasRenderingContext2D);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('keeps both ends of overflowing text and updates on resize', () => {
    render(<TestElement value="abcdefghij" />);

    act(() => resize([createResizeEntry(60)], {} as ResizeObserver));

    expect(screen.getByTestId(TEST_ID)).toHaveTextContent('abc…hij');
    expect(screen.getByTestId(TEST_ID)).toHaveAttribute('data-overflowing');

    act(() => resize([createResizeEntry(120)], {} as ResizeObserver));

    expect(screen.getByTestId(TEST_ID)).toHaveTextContent('abcdefghij');
    expect(screen.getByTestId(TEST_ID)).not.toHaveAttribute('data-overflowing');
  });
});
