import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { useRefs } from './useRefs';

describe('useRefs', () => {
  it('returns array of refs when passed a number', () => {
    const { result } = renderHook(() => useRefs<HTMLDivElement>(3));

    expect(Array.isArray(result.current)).toBe(true);
    expect(result.current.length).toBe(3);

    result.current.forEach((ref) => {
      expect(ref).toHaveProperty('current');
    });
  });

  it('returns object of refs when passed string array', () => {
    const keys = ['a', 'b', 'c'];

    const { result } = renderHook(() =>
      useRefs<HTMLDivElement, typeof keys>(keys)
    );

    expect(typeof result.current).toBe('object');

    keys.forEach((key) => {
      expect(result.current).toHaveProperty(key);
      expect(result.current[key]).toHaveProperty('current');
    });
  });

  it('returns object of refs when passed readonly string array', () => {
    const keys = ['x', 'y'] as const;

    const { result } = renderHook(() =>
      useRefs<HTMLDivElement, typeof keys>(keys)
    );

    expect(typeof result.current).toBe('object');

    keys.forEach((key) => {
      expect(result.current).toHaveProperty(key);
      expect(result.current[key]).toHaveProperty('current');
    });
  });

  it('returns same refs if deps don’t change', () => {
    const { result, rerender } = renderHook(
      ({ deps }) => useRefs<HTMLDivElement, ('a' | 'b')[]>(['a', 'b'], deps),
      { initialProps: { deps: [1] } }
    );

    const firstRefs = result.current;

    rerender({ deps: [1] });
    expect(result.current).toBe(firstRefs);
  });

  it('returns new refs if deps change', () => {
    const { result, rerender } = renderHook(
      ({ deps }) => useRefs<HTMLDivElement, ('a' | 'b')[]>(['a', 'b'], deps),
      { initialProps: { deps: [1] } }
    );

    const firstRefs = result.current;

    rerender({ deps: [2] });
    expect(result.current).not.toBe(firstRefs);
  });

  it('returns new refs if number changes', () => {
    const { result, rerender } = renderHook(
      ({ count }) => useRefs<HTMLDivElement>(count),
      { initialProps: { count: 2 } }
    );

    const firstRefs = result.current;

    rerender({ count: 3 });
    expect(result.current).not.toBe(firstRefs);
  });
});
