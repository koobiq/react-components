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
        data-testid="root"
        slotProps={{
          control: { 'data-testid': 'control' },
          clearButton: { 'aria-label': 'clear-button' },
          popover: { 'data-testid': 'popover' },
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

const getRoot = () => screen.getByTestId('root');
const getControl = () => screen.getByTestId('control');
const getClearButton = () => screen.getByLabelText('clear-button');
const queryPopover = () => screen.queryByTestId('popover');

describe('TreeSelect', () => {
  describe('rendering', () => {
    it('should render the label and placeholder', () => {
      renderTreeSelect({ placeholder: 'Select a file' });

      expect(screen.getByText('Files')).toBeInTheDocument();
      expect(getControl()).toHaveTextContent('Select a file');
    });

    it('should render the caption', () => {
      renderTreeSelect({ caption: 'Choose a project file' });

      expect(getRoot()).toHaveTextContent('Choose a project file');
    });

    it('should render start and end addons', () => {
      renderTreeSelect({ startAddon: 'start-addon', endAddon: 'end-addon' });

      expect(getRoot()).toHaveTextContent('start-addon');
      expect(getRoot()).toHaveTextContent('end-addon');
    });

    it('should render a static collection', () => {
      render(
        <Provider>
          <TreeSelect
            label="Files"
            defaultValue={7}
            slotProps={{ control: { 'data-testid': 'control' } }}
          >
            <TreeSelect.Item id={1} textValue="app">
              <TreeSelect.ItemContent>app</TreeSelect.ItemContent>
              <TreeSelect.Item id={2} textValue="Http">
                <TreeSelect.ItemContent>Http</TreeSelect.ItemContent>
              </TreeSelect.Item>
            </TreeSelect.Item>
            <TreeSelect.Item id={7} textValue="README.md">
              <TreeSelect.ItemContent>README.md</TreeSelect.ItemContent>
            </TreeSelect.Item>
          </TreeSelect>
        </Provider>
      );

      expect(getControl()).toHaveTextContent('README.md');
    });
  });

  describe('states', () => {
    it('should not open when disabled', async () => {
      const onOpenChange = vi.fn();

      renderTreeSelect({ isDisabled: true, onOpenChange });

      await userEvent.click(getControl());

      expect(getRoot()).toHaveAttribute('data-disabled', 'true');
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(queryPopover()).not.toBeInTheDocument();
    });

    it('should render the required state', () => {
      renderTreeSelect({ isRequired: true });

      expect(getRoot()).toHaveAttribute('data-required', 'true');
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should render the invalid state and error message', () => {
      renderTreeSelect({ isInvalid: true, errorMessage: 'Invalid selection' });

      expect(getRoot()).toHaveAttribute('data-invalid', 'true');
      expect(getRoot()).toHaveTextContent('Invalid selection');
    });

    it('should render full width', () => {
      renderTreeSelect({ fullWidth: true });

      expect(getRoot()).toHaveAttribute('data-fullwidth', 'true');
    });

    it('should apply label placement and alignment', () => {
      renderTreeSelect({ labelPlacement: 'side', labelAlign: 'end' });

      expect(getRoot()).toHaveAttribute('data-label-placement', 'side');
      expect(getRoot()).toHaveAttribute('data-label-align', 'end');
    });
  });

  describe('selection', () => {
    it('should render the default value in single mode', () => {
      renderTreeSelect({ defaultValue: 7 });

      expect(getControl()).toHaveTextContent('README.md');
    });

    it('should call onChange with a key in single mode', async () => {
      const onChange = vi.fn();

      renderTreeSelect({ defaultOpen: true, onChange });

      await userEvent.click(screen.getByTestId('item-7'));

      expect(onChange).toHaveBeenCalledWith(7);
      expect(getControl()).toHaveTextContent('README.md');
    });

    it('should render selected values as tags in multiple mode', () => {
      renderTreeSelect({
        selectionMode: 'multiple',
        defaultValue: [1, 7],
      });

      const control = getControl();

      expect(within(control).getByText('app')).toBeInTheDocument();
      expect(within(control).getByText('README.md')).toBeInTheDocument();
    });

    it('should call onChange with keys in multiple mode', async () => {
      const onChange = vi.fn();

      renderTreeSelect({
        selectionMode: 'multiple',
        defaultOpen: true,
        onChange,
      });

      await userEvent.click(screen.getByTestId('item-7'));

      expect(onChange).toHaveBeenCalledWith([7]);
    });

    it('should update the rendered value when the controlled value changes', () => {
      const { rerender } = renderTreeSelect({ value: 1 });

      expect(getControl()).toHaveTextContent('app');

      rerender(<TreeSelectFixture value={7} />);

      expect(getControl()).toHaveTextContent('README.md');
      expect(getControl()).not.toHaveTextContent('app');
    });
  });

  describe('disabled items', () => {
    it('should not select a disabled item', async () => {
      const onChange = vi.fn();

      renderTreeSelect({
        defaultOpen: true,
        disabledKeys: [7],
        onChange,
      });

      const item = screen.getByTestId('item-7');

      expect(item).toHaveAttribute('data-disabled', 'true');

      await userEvent.click(item);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe('clear button', () => {
    it('should be visible only when a value is selected', () => {
      const { rerender } = renderTreeSelect({ value: null, isClearable: true });

      expect(getClearButton()).toHaveAttribute('aria-hidden', 'true');

      rerender(<TreeSelectFixture value={1} isClearable />);

      expect(getClearButton()).not.toHaveAttribute('aria-hidden', 'true');
    });

    it('should call onChange with null when cleared in single mode', async () => {
      const onChange = vi.fn();

      renderTreeSelect({ value: 1, onChange, isClearable: true });

      await userEvent.click(getClearButton());

      expect(onChange).toHaveBeenCalledWith(null);
    });

    it('should call onChange with an empty array when cleared in multiple mode', async () => {
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

    it('should call onClear when cleared', async () => {
      const onClear = vi.fn();

      renderTreeSelect({ value: 1, onClear, isClearable: true });

      await userEvent.click(getClearButton());

      expect(onClear).toHaveBeenCalledTimes(1);
    });

    it('should be hidden when disabled', () => {
      renderTreeSelect({ value: 1, isClearable: true, isDisabled: true });

      expect(getClearButton()).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('open state', () => {
    it('should open by default with defaultOpen', () => {
      renderTreeSelect({ defaultOpen: true });

      expect(queryPopover()).toBeInTheDocument();
    });

    it('should call onOpenChange when the trigger is pressed', async () => {
      const onOpenChange = vi.fn();

      renderTreeSelect({ isOpen: false, onOpenChange });

      await userEvent.click(getControl());

      expect(onOpenChange).toHaveBeenCalledWith(true);
    });
  });
});
