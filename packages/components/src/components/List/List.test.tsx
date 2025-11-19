import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { Provider } from '../Provider';

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

  describe('noItemsText', () => {
    it('should display noItemsText for static items', () => {
      render(<List {...baseProps} noItemsText="empty"></List>);

      expect(getRoot()).toHaveTextContent('empty');
    });

    it('should display noItemsText for dynamic items', () => {
      render(<List {...baseProps} items={[]} noItemsText="empty" />);

      expect(getRoot()).toHaveTextContent('empty');
    });
  });

  describe('loading', () => {
    it('should display the loading text when isLoading={true}', async () => {
      render(
        <List {...baseProps} isLoading>
          <List.Item key="1">1</List.Item>
          <List.Item key="2">2</List.Item>
          <List.Item key="3">3</List.Item>
        </List>
      );

      expect(screen.getByText('Load More…')).toBeInTheDocument();
    });

    it('should NOT display noItemsText when isLoading={true}', () => {
      render(<List {...baseProps} noItemsText="empty" items={[]} isLoading />);

      expect(getRoot()).not.toHaveTextContent('empty');
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
        <List aria-label="Links">
          <List.Item href="/" data-testid="link">
            link
          </List.Item>
        </List>
      </Provider>
    );

    await userEvent.click(screen.getByTestId('link'));

    expect(onNavigate).toBeCalled();
  });
});
