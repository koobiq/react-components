import { describe, expect, it } from 'vitest';

import { flex } from './flex';
import s from './flex.module.css';

describe('flex', () => {
  it('should generate classes for every flex property', () => {
    expect(
      flex(
        {
          flex: 'inline-flex',
          wrap: 'wrap-reverse',
          order: -1,
          gap: 'm',
          rowGap: 'l',
          colGap: 'xl',
          direction: 'column-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
        },
        'custom-class'
      )
    ).toBe(
      [
        s.base,
        s['flex_inline-flex'],
        s['wrap_wrap-reverse'],
        s['order_-1'],
        s.gap_row_l,
        s.gap_column_xl,
        s['direction_column-reverse'],
        s.alignItems_center,
        s['justifyContent_space-between'],
        'custom-class',
      ].join(' ')
    );
  });

  it('should use gap as the row and column gap fallback', () => {
    expect(flex({ gap: 'm' })).toBe(
      [s.base, s.gap_row_m, s.gap_column_m].join(' ')
    );
  });

  it('should generate class for zero order', () => {
    expect(flex({ order: 0 })).toBe([s.base, s.order_0].join(' '));
  });
});
