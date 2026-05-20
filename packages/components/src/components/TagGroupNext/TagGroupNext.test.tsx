import { useState } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Provider } from '../Provider';

import { isInteractiveTarget } from './hooks/useTagItem';
import { TagGroupNext, type TagGroupNextProps } from './index';

const TAG_GROUP_NEXT_TEST_ID = 'TAG_GROUP_NEXT_TAG';

const renderComponent = (
  props: Omit<TagGroupNextProps<object>, 'children'>
) => (
  <TagGroupNext {...props} aria-label="tag-group-next">
    <TagGroupNext.Tag key={1}>one</TagGroupNext.Tag>
    <TagGroupNext.Tag key={2} data-testid={TAG_GROUP_NEXT_TEST_ID}>
      two
    </TagGroupNext.Tag>
    <TagGroupNext.Tag key={3}>three</TagGroupNext.Tag>
    <TagGroupNext.Tag key={4}>four</TagGroupNext.Tag>
  </TagGroupNext>
);

const removableItems = [
  { id: '1', name: 'one' },
  { id: '2', name: 'two' },
  { id: '3', name: 'three' },
  { id: '4', name: 'four' },
];

function RemovableTagGroupNext() {
  const [items, setItems] = useState(removableItems);

  return (
    <TagGroupNext<(typeof removableItems)[number]>
      aria-label="removable-tag-group-next"
      selectionMode="multiple"
      items={items}
      onRemove={(keys) => {
        setItems((currentItems) =>
          currentItems.filter((item) => !keys.has(item.id))
        );
      }}
    >
      {(item) => (
        <TagGroupNext.Tag key={item.id} data-testid={`tag-${item.id}`}>
          {item.name}
        </TagGroupNext.Tag>
      )}
    </TagGroupNext>
  );
}

describe('TagGroupNext', () => {
  const getTag = () => screen.getByTestId(TAG_GROUP_NEXT_TEST_ID);

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

  it('should toggle selection on ctrl click', async () => {
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

  it('should toggle selection on cmd click', async () => {
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
    await user.click(screen.getAllByRole('row')[0]);

    expect(getTag()).toHaveAttribute('data-selected', 'true');
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

    render(<RemovableTagGroupNext />);

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
});
