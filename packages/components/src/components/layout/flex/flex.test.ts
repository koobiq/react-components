import { describe, expect, it } from 'vitest';

import { flex } from './flex';

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
        'kbq-flex',
        'kbq-flex-flex_inline-flex',
        'kbq-flex-wrap_wrap-reverse',
        'kbq-flex-order_-1',
        'kbq-flex-gap_row_l',
        'kbq-flex-gap_column_xl',
        'kbq-flex-direction_column-reverse',
        'kbq-flex-alignItems_center',
        'kbq-flex-justifyContent_space-between',
        'custom-class',
      ].join(' ')
    );
  });

  it('should use gap as the row and column gap fallback', () => {
    expect(flex({ gap: 'm' })).toBe(
      ['kbq-flex', 'kbq-flex-gap_row_m', 'kbq-flex-gap_column_m'].join(' ')
    );
  });
});
