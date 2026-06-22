import { Collection, type SelectionMode } from '@koobiq/react-primitives';
import { render, screen, within } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Provider } from '../Provider';
import { Tree } from '../Tree';

import { TreeSelect } from './TreeSelect';
import type { TreeSelectProps } from './types';

type FileNode = { id: number; title: string; children: FileNode[] };

const items: FileNode[] = [
  {
    id: 1,
    title: 'app',
    children: [{ id: 2, title: 'Http', children: [] }],
  },
  { id: 7, title: 'README.md', children: [] },
];

function TreeSelectFixture<M extends SelectionMode = 'single'>(
  props: Partial<TreeSelectProps<FileNode, M>> = {}
) {
  return (
    <Provider>
      <TreeSelect
        items={items}
        label="Files"
        slotProps={{
          control: { 'data-testid': 'control' },
          clearButton: { 'aria-label': 'clear-button' },
        }}
        {...props}
      >
        {function renderItem(item: FileNode) {
          return (
            <Tree.Item
              key={item.id}
              textValue={item.title}
              data-testid={`item-${item.id}`}
            >
              <Tree.ItemContent>{item.title}</Tree.ItemContent>
              <Collection items={item.children}>{renderItem}</Collection>
            </Tree.Item>
          );
        }}
      </TreeSelect>
    </Provider>
  );
}

function renderTreeSelect<M extends SelectionMode = 'single'>(
  props: Partial<TreeSelectProps<FileNode, M>> = {}
) {
  return render(<TreeSelectFixture {...props} />);
}

const getControl = () => screen.getByTestId('control');
const getClearButton = () => screen.getByLabelText('clear-button');

describe('TreeSelect value', () => {
  it('calls onChange with a key in single mode', async () => {
    const onChange = vi.fn();

    renderTreeSelect({ defaultOpen: true, onChange });

    await userEvent.click(screen.getByTestId('item-7'));

    expect(onChange).toHaveBeenCalledWith(7);
    expect(getControl()).toHaveTextContent('README.md');
  });

  it('renders the selected values as tags in multiple mode', () => {
    renderTreeSelect({
      selectionMode: 'multiple',
      defaultValue: [1, 7],
    });

    const control = getControl();

    expect(within(control).getByText('app')).toBeInTheDocument();
    expect(within(control).getByText('README.md')).toBeInTheDocument();
  });

  it('calls onChange with keys in multiple mode', async () => {
    const onChange = vi.fn();

    renderTreeSelect({
      selectionMode: 'multiple',
      defaultOpen: true,
      onChange,
    });

    await userEvent.click(screen.getByTestId('item-7'));

    expect(onChange).toHaveBeenCalledWith([7]);
  });

  it('updates the rendered value when the controlled value changes', () => {
    const { rerender } = renderTreeSelect({ value: 1 });

    expect(getControl()).toHaveTextContent('app');

    rerender(<TreeSelectFixture value={7} />);

    expect(getControl()).toHaveTextContent('README.md');
    expect(getControl()).not.toHaveTextContent('app');
  });

  it('calls onChange with null when cleared in single mode', async () => {
    const onChange = vi.fn();

    renderTreeSelect({ value: 1, onChange, isClearable: true });

    await userEvent.click(getClearButton());

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('calls onChange with an empty array when cleared in multiple mode', async () => {
    const onChange = vi.fn();

    renderTreeSelect({
      selectionMode: 'multiple',
      value: [1, 7],
      onChange,
      isClearable: true,
    });

    await userEvent.click(getClearButton());

    expect(onChange).toHaveBeenCalledWith([]);
  });
});
