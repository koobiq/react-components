import { useRef } from 'react';

import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useCollapseAnimation } from './useCollapseAnimation';

const Test = ({
  isExpanded,
  duration,
}: {
  isExpanded: boolean;
  duration?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useCollapseAnimation(ref, isExpanded, duration);

  return <div ref={ref} data-testid="content" />;
};

describe('useCollapseAnimation', () => {
  const animate = vi.fn();
  let heights: number[];

  afterEach(() => {
    animate.mockClear();
    Reflect.deleteProperty(HTMLElement.prototype, 'animate');
    vi.restoreAllMocks();
  });

  const setup = (initialHeights: number[]) => {
    heights = initialHeights;

    Object.defineProperty(HTMLElement.prototype, 'animate', {
      configurable: true,
      value: animate,
    });

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      () => ({ height: heights.shift() ?? 0 }) as DOMRect
    );
  };

  it('animates the block size between the heights before and after', () => {
    setup([60, 120, 120]);

    const { rerender } = render(<Test isExpanded={false} />);

    rerender(<Test isExpanded />);

    expect(animate).toHaveBeenCalledWith(
      { blockSize: ['60px', '120px'], overflow: ['clip', 'clip'] },
      { duration: 100, easing: 'ease-in-out' }
    );
  });

  it('accepts a custom duration', () => {
    setup([60, 120, 120]);

    const { rerender } = render(<Test isExpanded={false} duration={250} />);

    rerender(<Test isExpanded duration={250} />);

    expect(animate).toHaveBeenCalledWith(expect.anything(), {
      duration: 250,
      easing: 'ease-in-out',
    });
  });

  it('does not animate on the first render or when the height is the same', () => {
    setup([60, 60, 60]);

    const { rerender } = render(<Test isExpanded={false} />);

    rerender(<Test isExpanded />);

    expect(animate).not.toHaveBeenCalled();
  });

  it('does not animate when the expanded state is unchanged', () => {
    setup([60, 120]);

    const { rerender } = render(<Test isExpanded={false} />);

    rerender(<Test isExpanded={false} />);

    expect(animate).not.toHaveBeenCalled();
  });
});
