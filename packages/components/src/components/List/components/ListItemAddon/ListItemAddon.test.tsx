import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { ListItemAddon, type ListItemAddonProps } from './index';

describe('ListItemAddon', () => {
  const baseProps: ListItemAddonProps = {
    children: 'content',
    'data-testid': 'root',
  };

  const getRoot = (): HTMLElement => screen.getByTestId('root');

  it('should accept the ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<ListItemAddon {...baseProps} ref={ref} />);

    expect(ref.current).toBe(getRoot());
  });

  it('should merge a custom class name with the default ones', () => {
    const props = {
      ...baseProps,
      className: 'foo',
    };

    render(<ListItemAddon {...props} />);

    expect(getRoot()).toHaveClass('foo');
  });
});
