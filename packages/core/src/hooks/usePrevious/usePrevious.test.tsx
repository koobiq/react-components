import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { usePrevious } from './index.js';

describe('usePrevious', () => {
  it('should return a previous value', () => {
    const { result, rerender } = renderHook((props) => usePrevious(props || 1));
    expect(result.current).toBe(null);

    rerender(2);
    expect(result.current).toBe(1);

    rerender(2);
    expect(result.current).toBe(2);

    rerender(3);
    expect(result.current).toBe(2);

    rerender(99);
    expect(result.current).toBe(3);

    rerender(4);
    expect(result.current).toBe(99);
  });
});
