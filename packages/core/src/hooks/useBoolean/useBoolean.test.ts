import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { useBoolean } from './useBoolean.js';

describe('useBoolean', () => {
  it('should return the value correctly', () => {
    const { result } = renderHook(() => useBoolean(false));
    expect(result.current[0]).toBe(false);

    act(result.current[1].on);
    expect(result.current[0]).toBe(true);

    act(result.current[1].off);
    expect(result.current[0]).toBe(false);

    act(result.current[1].toggle);
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1].set((x) => !x);
    });

    expect(result.current[0]).toBe(false);
  });
});
