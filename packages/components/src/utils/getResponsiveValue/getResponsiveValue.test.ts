import { describe, it, expect } from 'vitest';

import type { ResponsiveValue } from './index';
import { getResponsiveValue } from './index';

describe('getResponsiveValue', () => {
  it('should return the value directly if prop is not an object', () => {
    expect(getResponsiveValue(42, ['xs', 'm', 'l'])).toBe(42);
    expect(getResponsiveValue('test', ['xs', 'm', 'l'])).toBe('test');
  });

  it('should return undefined if no breakpoints match', () => {
    const prop: ResponsiveValue<number> = { xs: 1, m: 2 };
    expect(getResponsiveValue(prop, ['l'])).toBeUndefined();
  });

  it('should return the last matching breakpoint value', () => {
    const prop: ResponsiveValue<number> = { xs: 1, m: 2, l: 3 };
    expect(getResponsiveValue(prop, ['xs', 'm', 'l'])).toBe(3);
    expect(getResponsiveValue(prop, ['m', 'xs'])).toBe(1);
  });

  it('should return the previous matching breakpoint value', () => {
    const prop: ResponsiveValue<number> = { xs: 1, l: 2 };
    expect(getResponsiveValue(prop, ['xs', 's'])).toBe(1);
  });

  it('should handle an empty breakpoints array', () => {
    const prop: ResponsiveValue<number> = { xs: 1, m: 2 };
    expect(getResponsiveValue(prop, [])).toBeUndefined();
  });

  it('should handle null or undefined prop', () => {
    expect(getResponsiveValue(null, ['xs', 'm', 'l'])).toBeNull();
    expect(getResponsiveValue(undefined, ['xs', 'm', 'l'])).toBeUndefined();
  });

  it('should handle complex types as values', () => {
    const prop: ResponsiveValue<{ key: string }> = {
      xs: { key: 'value1' },
      m: { key: 'value2' },
    };

    expect(getResponsiveValue(prop, ['m', 'xs'])).toEqual({ key: 'value1' });
  });
});
