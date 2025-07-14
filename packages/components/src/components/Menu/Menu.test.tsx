import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Menu } from './Menu';

describe('Menu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const onOpenChange = vi.fn();

  const baseProps = {
    'data-testid': 'root',
    onOpenChange,
  };

  const getRoot = () => screen.getByTestId('root');
  const getHeader = () => screen.getByTestId('header');

  it('should forward a ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <Menu {...baseProps} ref={ref} isOpen>
        <Menu.Item>item</Menu.Item>
      </Menu>
    );

    expect(ref.current).toBe(getRoot());
  });

  it('should merge a custom class name with the default ones', () => {
    const className = 'foo';

    render(
      <Menu {...baseProps} className={className} isOpen>
        <Menu.Item>item</Menu.Item>
      </Menu>
    );

    const root = getRoot();
    expect(root?.className).toContain(className);
  });

  describe('check Menu.Header', () => {
    const className = 'foo';

    it('should merge a custom class name with the default ones', () => {
      render(
        <Menu isOpen>
          <Menu.Header className={className} data-testid="header">
            item
          </Menu.Header>
        </Menu>
      );

      const header = getHeader();
      expect(header?.className).toContain(className);
    });
  });
});
