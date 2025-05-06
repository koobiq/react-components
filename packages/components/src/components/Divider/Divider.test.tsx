import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Divider } from './index';

describe('Divider', () => {
  const baseProps = { 'data-testid': 'divider' };

  it('should accept the ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(<Divider {...baseProps} ref={ref} />);

    const divider = screen.getByTestId('divider');

    expect(ref.current).toBe(divider);
  });

  it('should accept the custom root tag', () => {
    const ref = createRef<HTMLLIElement>();

    render(<Divider {...baseProps} as="li" ref={ref} />);

    const button = screen.getByTestId('divider');
    expect(button.tagName).toBe('LI');
  });

  it('should merge a custom class name with the default ones', () => {
    const props = {
      ...baseProps,
      className: 'foo',
    };

    render(<Divider {...props} />);

    const divider = screen.getByTestId('divider');

    expect(divider).toHaveClass('foo');
  });
});
