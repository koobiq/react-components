import { createRef, type ReactNode } from 'react';

import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { List } from '../List';
import { Provider } from '../Provider';

import { ClampedList, type ClampedListState } from './index';

type Item = {
  id: number;
  name: string;
};

const createItems = (length: number): Item[] =>
  Array.from({ length }, (_, index) => ({
    id: index + 1,
    name: `Item ${index + 1}`,
  }));

function renderItems({
  visibleItems,
  hiddenItemCount,
  isExpanded,
}: ClampedListState<Item>): ReactNode {
  return (
    <ul
      data-testid="items"
      data-hidden-count={hiddenItemCount}
      data-expanded={isExpanded}
    >
      {visibleItems.map((item) => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

const getRenderedItems = () =>
  within(screen.getByTestId('items')).getAllByRole('listitem');

describe('ClampedList', () => {
  it('renders the default collapsed state and accessible trigger', () => {
    render(<ClampedList items={createItems(17)}>{renderItems}</ClampedList>);

    const content = screen.getByRole('group');
    const trigger = screen.getByRole('button', { name: 'Show 7 more' });

    expect(getRenderedItems()).toHaveLength(10);

    expect(screen.getByTestId('items')).toHaveAttribute(
      'data-hidden-count',
      '7'
    );

    expect(screen.getByTestId('items')).toHaveAttribute(
      'data-expanded',
      'false'
    );

    expect(content.id).not.toBe('');
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('aria-controls', content.id);
    expect(content).not.toContainElement(trigger);
    expect(trigger.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a trigger when the hidden count equals the threshold', () => {
    render(<ClampedList items={createItems(16)}>{renderItems}</ClampedList>);

    expect(
      screen.getByRole('button', { name: 'Show 6 more' })
    ).toBeInTheDocument();

    expect(getRenderedItems()).toHaveLength(10);
  });

  it('renders all items without a trigger below the threshold', () => {
    render(<ClampedList items={createItems(15)}>{renderItems}</ClampedList>);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(getRenderedItems()).toHaveLength(15);

    expect(screen.getByTestId('items')).toHaveAttribute(
      'data-hidden-count',
      '5'
    );

    expect(screen.getByTestId('items')).toHaveAttribute(
      'data-expanded',
      'true'
    );
  });

  it('renders an empty collection as expanded without a trigger', () => {
    render(<ClampedList items={[]}>{renderItems}</ClampedList>);

    expect(screen.getByTestId('items')).toBeEmptyDOMElement();

    expect(screen.getByTestId('items')).toHaveAttribute(
      'data-hidden-count',
      '0'
    );

    expect(screen.getByTestId('items')).toHaveAttribute(
      'data-expanded',
      'true'
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('supports custom counts and non-array iterables', () => {
    const items = new Set(createItems(8));

    render(
      <ClampedList items={items} collapsedVisibleCount={3} hiddenThreshold={5}>
        {renderItems}
      </ClampedList>
    );

    expect(getRenderedItems()).toHaveLength(3);

    expect(
      screen.getByRole('button', { name: 'Show 5 more' })
    ).toBeInTheDocument();
  });

  it('keeps a one-shot iterable materialized while toggling', async () => {
    function* generateItems() {
      yield* createItems(17);
    }

    const user = userEvent.setup();

    render(<ClampedList items={generateItems()}>{renderItems}</ClampedList>);

    await user.click(screen.getByRole('button', { name: 'Show 7 more' }));

    expect(getRenderedItems()).toHaveLength(17);

    expect(
      screen.getByRole('button', { name: 'Collapse' })
    ).toBeInTheDocument();
  });

  it('supports defaultExpanded and uncontrolled keyboard toggling', async () => {
    const onExpandedChange = vi.fn();
    const user = userEvent.setup();

    render(
      <ClampedList
        items={createItems(17)}
        defaultExpanded
        onExpandedChange={onExpandedChange}
      >
        {renderItems}
      </ClampedList>
    );

    const trigger = screen.getByRole('button', { name: 'Collapse' });

    expect(getRenderedItems()).toHaveLength(17);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    trigger.focus();
    await user.keyboard('{Enter}');

    expect(getRenderedItems()).toHaveLength(10);

    expect(screen.getByRole('button', { name: 'Show 7 more' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );

    await user.keyboard(' ');

    expect(getRenderedItems()).toHaveLength(17);

    expect(onExpandedChange.mock.calls.map(([value]) => value)).toEqual([
      false,
      true,
    ]);
  });

  it('supports controlled expansion', async () => {
    const onExpandedChange = vi.fn();
    const user = userEvent.setup();
    const items = createItems(17);

    const { rerender } = render(
      <ClampedList
        items={items}
        isExpanded={false}
        onExpandedChange={onExpandedChange}
      >
        {renderItems}
      </ClampedList>
    );

    await user.click(screen.getByRole('button', { name: 'Show 7 more' }));

    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(getRenderedItems()).toHaveLength(10);

    expect(screen.getByRole('button', { name: 'Show 7 more' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );

    rerender(
      <ClampedList items={items} isExpanded onExpandedChange={onExpandedChange}>
        {renderItems}
      </ClampedList>
    );

    expect(getRenderedItems()).toHaveLength(17);

    expect(screen.getByRole('button', { name: 'Collapse' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    expect(onExpandedChange).toHaveBeenCalledTimes(1);
  });

  it('preserves the expansion preference while the trigger is unnecessary', async () => {
    const user = userEvent.setup();
    const expandedItems = createItems(17);

    const { rerender } = render(
      <ClampedList items={expandedItems}>{renderItems}</ClampedList>
    );

    await user.click(screen.getByRole('button', { name: 'Show 7 more' }));

    rerender(<ClampedList items={createItems(12)}>{renderItems}</ClampedList>);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(getRenderedItems()).toHaveLength(12);

    rerender(<ClampedList items={expandedItems}>{renderItems}</ClampedList>);

    expect(getRenderedItems()).toHaveLength(17);

    expect(
      screen.getByRole('button', { name: 'Collapse' })
    ).toBeInTheDocument();
  });

  it('supports custom toggle labels', async () => {
    const user = userEvent.setup();

    render(
      <ClampedList
        items={createItems(17)}
        moreText={<span>Reveal all items</span>}
        lessText={<span>Hide extra items</span>}
      >
        {renderItems}
      </ClampedList>
    );

    await user.click(screen.getByRole('button', { name: 'Reveal all items' }));

    expect(
      screen.getByRole('button', { name: 'Hide extra items' })
    ).toBeInTheDocument();
  });

  it('supports customizing the content and toggle slots', async () => {
    const contentRef = createRef<HTMLDivElement>();
    const toggleRef = createRef<HTMLButtonElement>();
    const onContentClick = vi.fn();
    const onTogglePress = vi.fn();
    const user = userEvent.setup();

    render(
      <ClampedList
        items={createItems(17)}
        moreText="Show custom list"
        lessText="Collapse custom list"
        slotProps={{
          content: {
            id: 'custom-content',
            ref: contentRef,
            className: 'custom-content',
            style: { color: 'red' },
            'data-testid': 'custom-content',
            onClick: onContentClick,
          },
          toggle: {
            ref: toggleRef,
            className: 'custom-toggle',
            style: { inlineSize: '100%' },
            'data-testid': 'custom-toggle',
            onPress: onTogglePress,
          },
        }}
      >
        {renderItems}
      </ClampedList>
    );

    const content = screen.getByRole('group');
    const toggle = screen.getByRole('button', { name: 'Show custom list' });

    expect(contentRef.current).toBe(content);
    expect(content).toHaveAttribute('id', 'custom-content');
    expect(content).toHaveClass('custom-content');
    expect(content.style.color).toBe('red');
    expect(content).toHaveAttribute('data-testid', 'custom-content');

    expect(toggleRef.current).toBe(toggle);
    expect(toggle).toHaveAttribute('type', 'button');
    expect(toggle).toHaveAttribute('aria-controls', 'custom-content');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveClass('custom-toggle');
    expect(toggle).toHaveStyle({ inlineSize: '100%' });
    expect(toggle).toHaveAttribute('data-testid', 'custom-toggle');

    fireEvent.click(content);
    expect(onContentClick).toHaveBeenCalledTimes(1);

    await user.click(toggle);

    expect(getRenderedItems()).toHaveLength(17);
    expect(onTogglePress).toHaveBeenCalledTimes(1);

    expect(
      screen.getByRole('button', { name: 'Collapse custom list' })
    ).toHaveAttribute('aria-expanded', 'true');
  });

  it('uses localized trigger content', () => {
    render(
      <Provider locale="ru-RU">
        <ClampedList items={createItems(17)}>{renderItems}</ClampedList>
      </Provider>
    );

    expect(
      screen.getByRole('button', { name: 'Показать ещё 7' })
    ).toBeInTheDocument();
  });

  it('renders the trigger outside a nested Koobiq List', async () => {
    const user = userEvent.setup();
    const items = createItems(17);

    render(
      <ClampedList items={items}>
        {({ visibleItems }) => (
          <List aria-label="Items" items={visibleItems} selectionMode="none">
            {(item) => <List.Item>{item.name}</List.Item>}
          </List>
        )}
      </ClampedList>
    );

    const content = screen.getByRole('group');
    const listbox = screen.getByRole('listbox', { name: 'Items' });
    const trigger = screen.getByRole('button', { name: 'Show 7 more' });

    expect(within(listbox).getAllByRole('option')).toHaveLength(10);
    expect(content).toContainElement(listbox);
    expect(content).not.toContainElement(trigger);
    expect(listbox).not.toContainElement(trigger);

    await user.click(trigger);

    expect(within(listbox).getAllByRole('option')).toHaveLength(17);
  });
});
