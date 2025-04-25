import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { List } from './index';

describe('List', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const onOpenChange = vi.fn();

  const baseProps = {
    'data-testid': 'root',
    onOpenChange,
    'aria-label': 'list',
  };

  const getRoot = () => screen.getByTestId('root');
  const getItem = () => screen.getByTestId('item');

  it('should forward a ref', () => {
    const ref = createRef<HTMLUListElement>();

    render(
      <List {...baseProps} ref={ref}>
        <List.Item>item</List.Item>
      </List>
    );

    expect(ref.current).toBe(getRoot());
  });

  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';

    render(
      <List {...baseProps} className={className}>
        <List.Item>item</List.Item>
      </List>
    );

    const root = getRoot();
    expect(root?.className).toContain(className);
  });

  describe('check an item', () => {
    it('should merge a custom class name with the default ones', () => {
      const className = 'foo';

      render(
        <List {...baseProps}>
          <List.Item className={className} data-testid="item">
            item
          </List.Item>
        </List>
      );

      const root = getItem();
      expect(root?.className).toContain(className);
    });
  });
});
