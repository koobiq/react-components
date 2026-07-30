import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { BreakpointsContext, type BreakpointsContextType } from '../Provider';

import { FlexBox } from './index';
import type { FlexBoxProps } from './index';

describe('FlexBox', () => {
  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';

    const props: FlexBoxProps = {
      className,
    };

    const { container } = render(<FlexBox {...props} />);

    const flexBox = container.querySelector('div');

    expect(flexBox).toHaveClass(className);
  });

  it('should forward a ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<FlexBox ref={ref} />);
    const flexBox = container.querySelector('div');
    expect(ref.current).toBe(flexBox);
  });

  it('should apply flex classes from props', () => {
    render(
      <FlexBox
        data-testid="flex-box"
        flex="inline-flex"
        wrap="wrap-reverse"
        gap="m"
        rowGap="l"
        colGap="xl"
        direction="column-reverse"
        alignItems="center"
        justifyContent="space-between"
      />
    );

    expect(screen.getByTestId('flex-box')).toHaveClass(
      'kbq-flex',
      'kbq-flex-flex_inline-flex',
      'kbq-flex-wrap_wrap-reverse',
      'kbq-flex-gap_row_l',
      'kbq-flex-gap_column_xl',
      'kbq-flex-direction_column-reverse',
      'kbq-flex-alignItems_center',
      'kbq-flex-justifyContent_space-between'
    );
  });

  it('should apply flex classes from responsive props', () => {
    const breakpoints = {
      xs: true,
      l: true,
    } as BreakpointsContextType;

    render(
      <BreakpointsContext.Provider value={breakpoints}>
        <FlexBox
          data-testid="flex-box"
          gap={{ xs: 's', l: 'm' }}
          direction={{ xs: 'column', l: 'row' }}
        />
      </BreakpointsContext.Provider>
    );

    expect(screen.getByTestId('flex-box')).toHaveClass(
      'kbq-flex-gap_row_m',
      'kbq-flex-gap_column_m',
      'kbq-flex-direction_row'
    );
  });
});
