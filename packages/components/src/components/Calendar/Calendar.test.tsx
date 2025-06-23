import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Calendar } from './Calendar';

describe('Calendar', () => {
  const baseProps = { 'data-testid': 'calendar' };

  const getRoot = () => screen.getByTestId<HTMLButtonElement>('calendar');

  it('should accept the ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Calendar {...baseProps} ref={ref} />);
    const el = container.querySelector('div');
    expect(ref.current).toBe(el);
  });

  it('should accept a custom class', () => {
    render(<Calendar {...baseProps} className="foo" />);

    expect(getRoot()).toHaveClass('foo');
  });
});
