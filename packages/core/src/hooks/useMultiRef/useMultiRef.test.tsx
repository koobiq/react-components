import { useRef } from 'react';

import { render, renderHook } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';

import { useMultiRef } from './index.js';

describe('useMultiRef', () => {
  it('should correctly accept an empty refs array', () => {
    const {
      result: { current },
    } = renderHook(() => useMultiRef([]));

    expect(current).toBe(null);
  });

  it('should correctly accept a refs array', () => {
    const {
      result: { current: ref1 },
    } = renderHook(() => useRef<HTMLDivElement>(null));

    // ref as a function
    const ref2 = vi.fn();

    render(
      <div ref={renderHook(() => useMultiRef([ref1, ref2])).result.current} />
    );

    expect(ref1.current).toMatchInlineSnapshot('<div />');
    expect(ref2).toBeCalled();
    expect(ref2.mock.calls[0]?.[0]).toMatchInlineSnapshot('<div />');
  });
});
