import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { Button } from '../Button';
import { Provider } from '../Provider';

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

  it('check a client side routing', async () => {
    const onNavigate = vi.fn();

    render(
      <Provider
        router={{
          navigate: () => {
            onNavigate();
          },
        }}
      >
        <Menu
          aria-label="Links"
          isOpen
          control={(props) => <Button {...props}>Actions</Button>}
        >
          <Menu.Item href="/" data-testid="link">
            link
          </Menu.Item>
        </Menu>
      </Provider>
    );

    await userEvent.click(screen.getByTestId('link'));

    expect(onNavigate).toBeCalled();
  });
});
