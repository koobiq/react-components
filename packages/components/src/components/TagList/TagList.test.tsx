import { createRef, useState } from 'react';

import { isInteractiveTarget } from '@koobiq/react-primitives';
import { render, screen, waitFor, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Provider } from '../Provider';

import { TagList, type TagListProps } from './index';

const TAG_LIST_TEST_ID = 'TAG_LIST_TAG';

const renderComponent = (props: Omit<TagListProps<object>, 'children'>) => (
  <TagList {...props} aria-label="tag-list">
    <TagList.Tag key={1}>one</TagList.Tag>
    <TagList.Tag key={2} data-testid={TAG_LIST_TEST_ID}>
      two
    </TagList.Tag>
    <TagList.Tag key={3}>three</TagList.Tag>
    <TagList.Tag key={4}>four</TagList.Tag>
  </TagList>
);

const removableItems = [
  { id: '1', name: 'one' },
  { id: '2', name: 'two' },
  { id: '3', name: 'three' },
  { id: '4', name: 'four' },
];

function RemovableTagList() {
  const [items, setItems] = useState(removableItems);

  return (
    <TagList<(typeof removableItems)[number]>
      aria-label="removable-tag-list"
      selectionMode="multiple"
      items={items}
      onRemove={(keys) => {
        setItems((currentItems) =>
          currentItems.filter((item) => !keys.has(item.id))
        );
      }}
    >
      {(item) => (
        <TagList.Tag key={item.id} data-testid={`tag-${item.id}`}>
          {item.name}
        </TagList.Tag>
      )}
    </TagList>
  );
}

describe('TagList', () => {
  const getTag = () => screen.getByTestId(TAG_LIST_TEST_ID);

  it('should detect nested focusable interaction targets', () => {
    const root = document.createElement('div');
    const button = document.createElement('button');
    const buttonIcon = document.createElement('span');
    const disabledButton = document.createElement('button');

    disabledButton.disabled = true;
    button.append(buttonIcon);
    root.append(button, disabledButton);
    document.body.append(root);

    try {
      expect(isInteractiveTarget(buttonIcon, root)).toBe(true);
      expect(isInteractiveTarget(button, root)).toBe(true);
      expect(isInteractiveTarget(root, root)).toBe(false);
      expect(isInteractiveTarget(disabledButton, root)).toBe(false);
    } finally {
      root.remove();
    }
  });

  it('should not select on plain click', async () => {
    const onSelectionChange = vi.fn();

    render(
      renderComponent({
        selectionMode: 'multiple',
        onSelectionChange,
      })
    );

    await userEvent.click(getTag());

    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(getTag()).not.toHaveAttribute('data-selected');
  });

  it('should toggle selection on ctrl+click', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    render(
      renderComponent({
        selectionMode: 'multiple',
        onSelectionChange,
      })
    );

    await user.keyboard('{Control>}');
    await user.click(getTag());
    await user.keyboard('{/Control}');

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(getTag()).toHaveAttribute('data-selected', 'true');
  });

  it('should toggle selection on cmd+click', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    render(
      renderComponent({
        selectionMode: 'multiple',
        onSelectionChange,
      })
    );

    await user.keyboard('{Meta>}');
    await user.click(getTag());
    await user.keyboard('{/Meta}');

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(getTag()).toHaveAttribute('data-selected', 'true');
  });

  it('should select focused tag on Space', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    render(
      renderComponent({
        selectionMode: 'multiple',
        onSelectionChange,
      })
    );

    await user.click(getTag());
    await user.keyboard('{Space}');

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    expect(getTag()).toHaveAttribute('data-selected', 'true');
  });

  it('should move focus with arrow keys', async () => {
    const user = userEvent.setup();

    render(renderComponent({ selectionMode: 'multiple' }));

    await user.click(getTag());
    await user.keyboard('{ArrowRight}');

    await waitFor(() =>
      expect(screen.getByText('three').closest('[role="row"]')).toHaveFocus()
    );

    await user.keyboard('{ArrowLeft}');

    await waitFor(() => expect(getTag()).toHaveFocus());
  });

  it('should not select focused tag on Enter', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    render(
      renderComponent({
        selectionMode: 'multiple',
        onSelectionChange,
      })
    );

    await user.click(getTag());
    await user.keyboard('{Enter}');

    expect(onSelectionChange).not.toHaveBeenCalled();
    expect(getTag()).not.toHaveAttribute('data-selected');
  });

  it('should select all tags on Ctrl+A', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    render(
      renderComponent({
        selectionMode: 'multiple',
        onSelectionChange,
      })
    );

    await user.click(getTag());
    await user.keyboard('{Control>}a{/Control}');

    expect(onSelectionChange).toHaveBeenCalledTimes(1);

    screen
      .getAllByRole('row')
      .forEach((tag) => expect(tag).toHaveAttribute('aria-selected', 'true'));
  });

  it('should keep selection when focus moves inside tag group', async () => {
    const user = userEvent.setup();

    render(renderComponent({ selectionMode: 'multiple' }));

    await user.click(getTag());
    await user.keyboard('{Space}');
    const firstRow = screen.getAllByRole('row')[0];
    if (firstRow) await user.click(firstRow);

    expect(getTag()).toHaveAttribute('data-selected', 'true');
  });

  it('should let an individual tag override the parent variant', () => {
    render(
      <TagList variant="theme-fade" aria-label="tag-list">
        <TagList.Tag key="default">Default</TagList.Tag>
        <TagList.Tag key="custom" variant="error-fade">
          Custom
        </TagList.Tag>
      </TagList>
    );

    expect(screen.getByText('Default').closest('[role="row"]')).toHaveAttribute(
      'data-variant',
      'theme-fade'
    );

    expect(screen.getByText('Custom').closest('[role="row"]')).toHaveAttribute(
      'data-variant',
      'error-fade'
    );
  });

  it('should clear selection when focus leaves tag group', async () => {
    const user = userEvent.setup();

    render(
      <>
        {renderComponent({ selectionMode: 'multiple' })}
        <button data-testid="outside">outside</button>
      </>
    );

    await user.click(getTag());
    await user.keyboard('{Space}');
    await user.click(screen.getByTestId('outside'));

    expect(getTag()).not.toHaveAttribute('data-selected');
  });

  it('should remove focused tag after selected tags were removed', async () => {
    const user = userEvent.setup();

    render(<RemovableTagList />);

    await user.keyboard('{Control>}');
    await user.click(screen.getByTestId('tag-2'));
    await user.click(screen.getByTestId('tag-3'));
    await user.keyboard('{/Control}');

    const selectedTag = screen.getByTestId('tag-3');

    await user.click(selectedTag);
    await user.keyboard('{Delete}');

    await waitFor(() => {
      expect(screen.queryByTestId('tag-2')).toBeNull();
      expect(screen.queryByTestId('tag-3')).toBeNull();
    });

    const focusedTag = screen.getByTestId('tag-4');

    await user.click(focusedTag);
    await user.keyboard('{Delete}');

    await waitFor(() => expect(screen.queryByTestId('tag-4')).toBeNull());
  });

  it('should localize the remove button aria-label (en-US by default)', () => {
    const { container } = render(
      renderComponent({
        onRemove: vi.fn(),
      })
    );

    const buttons = container.querySelectorAll('button[aria-label="Remove"]');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should localize the remove button aria-label under ru-RU locale', () => {
    const { container } = render(
      <Provider locale="ru-RU">
        {renderComponent({ onRemove: vi.fn() })}
      </Provider>
    );

    const buttons = container.querySelectorAll('button[aria-label="Удалить"]');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should not add aria-describedby when onRemove is not provided', () => {
    render(renderComponent({}));

    expect(getTag()).not.toHaveAttribute('aria-describedby');
  });

  it('should announce the removal shortcut to screen readers after keyboard interaction', async () => {
    const user = userEvent.setup();

    render(renderComponent({ onRemove: vi.fn() }));

    // Force keyboard modality — without a user keyboard event the modality
    // stays at its initial value and the description is intentionally not
    // attached (pointer users see the visible remove button).
    await user.tab();

    await waitFor(() => {
      const tag = getTag();
      const describedBy = tag.getAttribute('aria-describedby');
      expect(describedBy).toBeTruthy();

      const description = document.getElementById(describedBy ?? '');
      expect(description?.textContent).toMatch(/delete or backspace/i);
    });
  });

  it('should auto-focus the first tag when autoFocus="first"', async () => {
    render(renderComponent({ autoFocus: 'first' }));

    await waitFor(() =>
      expect(screen.getByText('one').closest('[role="row"]')).toHaveFocus()
    );
  });

  it('should auto-focus the last tag when autoFocus="last"', async () => {
    render(renderComponent({ autoFocus: 'last' }));

    await waitFor(() =>
      expect(screen.getByText('four').closest('[role="row"]')).toHaveFocus()
    );
  });

  it('should reflect controlled selectedKeys from props', () => {
    render(
      renderComponent({
        selectionMode: 'multiple',
        // React stringifies element keys, so the collection node id is '2'.
        selectedKeys: new Set(['2']),
      })
    );

    expect(getTag()).toHaveAttribute('aria-selected', 'true');
    expect(getTag()).toHaveAttribute('data-selected', 'true');
  });

  it('should call onSelectionChange when user toggles a controlled key', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();

    render(
      renderComponent({
        selectionMode: 'multiple',
        selectedKeys: new Set<string>(),
        onSelectionChange,
      })
    );

    await user.keyboard('{Control>}');
    await user.click(getTag());
    await user.keyboard('{/Control}');

    expect(onSelectionChange).toHaveBeenCalledTimes(1);
    const next = onSelectionChange.mock.calls[0]?.[0] as Set<string>;
    expect([...next]).toContain('2');
  });

  it('should keep selection on Escape when escapeKeyBehavior="none"', async () => {
    const user = userEvent.setup();

    render(
      renderComponent({
        selectionMode: 'multiple',
        escapeKeyBehavior: 'none',
      })
    );

    await user.click(getTag());
    await user.keyboard('{Space}');
    expect(getTag()).toHaveAttribute('data-selected', 'true');

    await user.keyboard('{Escape}');
    expect(getTag()).toHaveAttribute('data-selected', 'true');
  });

  it('should render role="group" when collection is empty', () => {
    render(
      <TagList aria-label="empty" items={[] as Iterable<{ id: string }>}>
        {() => <TagList.Tag>unused</TagList.Tag>}
      </TagList>
    );

    expect(screen.getByRole('group')).toBeInTheDocument();
    expect(screen.queryByRole('grid')).toBeNull();
  });

  it('should react to items prop mutations', () => {
    type Item = { id: string; name: string };

    const initial: Item[] = [
      { id: '1', name: 'one' },
      { id: '2', name: 'two' },
    ];

    const extended: Item[] = [...initial, { id: '3', name: 'three' }];

    const Wrapper = ({ items }: { items: Item[] }) => (
      <TagList<Item> aria-label="mutating" items={items}>
        {(item) => (
          <TagList.Tag key={item.id} data-testid={`tag-${item.id}`}>
            {item.name}
          </TagList.Tag>
        )}
      </TagList>
    );

    const { rerender } = render(<Wrapper items={initial} />);
    expect(screen.queryByTestId('tag-3')).toBeNull();

    rerender(<Wrapper items={extended} />);
    expect(screen.getByTestId('tag-3')).toBeInTheDocument();
  });

  it('should render a disabled remove button on a disabled tag', async () => {
    const onRemove = vi.fn();

    render(
      renderComponent({
        onRemove,
        disabledKeys: ['2'],
      })
    );

    // The affordance stays — the button is rendered but in a disabled
    // state. Every tag in the fixture still gets its remove button.
    const disabledTag = getTag();
    const button = within(disabledTag).getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.queryAllByRole('button')).toHaveLength(4);

    // Clicking the disabled button must not trigger onRemove.
    await userEvent.click(button);
    expect(onRemove).not.toHaveBeenCalled();
  });

  describe('prop forwarding', () => {
    it('should forward className to the root element', () => {
      const { container } = render(
        renderComponent({ className: 'custom-root' })
      );

      expect(container.firstElementChild).toHaveClass('custom-root');
    });

    it('should forward style to the root element', () => {
      const { container } = render(renderComponent({ style: { padding: 20 } }));

      expect(container.firstElementChild).toHaveStyle({ padding: '20px' });
    });

    it('should forward ref to the root element', () => {
      const ref = createRef<HTMLDivElement>();
      const { container } = render(renderComponent({ ref }));

      expect(ref.current).toBe(container.firstElementChild);
    });

    it('should forward data-testid to the root element', () => {
      render(renderComponent({ 'data-testid': 'TAG_LIST_ROOT' }));

      expect(screen.getByTestId('TAG_LIST_ROOT')).toBeInTheDocument();
    });

    it('should forward className to a Tag element', () => {
      render(
        <TagList aria-label="x">
          <TagList.Tag key="1" className="tag-class" data-testid="single-tag">
            one
          </TagList.Tag>
        </TagList>
      );

      expect(screen.getByTestId('single-tag')).toHaveClass('tag-class');
    });

    it('should forward style to a Tag element', () => {
      render(
        <TagList aria-label="x">
          <TagList.Tag key="1" style={{ padding: 5 }} data-testid="single-tag">
            one
          </TagList.Tag>
        </TagList>
      );

      expect(screen.getByTestId('single-tag')).toHaveStyle({ padding: '5px' });
    });
  });
});
