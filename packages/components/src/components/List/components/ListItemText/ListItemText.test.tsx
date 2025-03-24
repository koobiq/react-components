import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ListItemText, type ListItemTextProps } from './ListItemText';

describe('ListItemText', () => {
  const baseProps: ListItemTextProps = {
    children: 'content',
    caption: 'caption',
    'data-testid': 'root',
  };

  const getRoot = (): HTMLElement => screen.getByTestId('root');

  it('should accept the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ListItemText {...baseProps} ref={ref} />);

    expect(ref.current).toBe(getRoot());
  });

  it('should merge a custom class name with the default ones', () => {
    const props = {
      ...baseProps,
      className: 'foo',
    };

    render(<ListItemText {...props} />);

    expect(getRoot()).toHaveClass('foo');
  });
});
