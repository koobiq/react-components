import { createRef } from 'react';

import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Table } from './index';
import type { TableProps } from './types';

const renderComponent = (props: Omit<TableProps<object>, 'children'>) => {
  type Row = {
    id: number;
    name: string;
    type: string;
  };

  const columns: Array<{ name: string; key: keyof Row }> = [
    { name: 'Name', key: 'name' },
    { name: 'Type', key: 'type' },
  ];

  const rows: Row[] = [
    {
      id: 1,
      name: 'home',
      type: 'File folder',
    },
    {
      id: 2,
      name: 'etc',
      type: 'File folder',
    },
    {
      id: 3,
      name: 'vmlinuz',
      type: 'System file',
    },
    {
      id: 4,
      name: 'log.txt',
      type: 'Text file',
    },
  ];

  return (
    <Table aria-label="Example table" {...props}>
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column key={column.key}>{column.name}</Table.Column>
        )}
      </Table.Header>
      <Table.Body items={rows}>
        {(item) => (
          <Table.Row>
            {(columnKey) => (
              <Table.Cell>{item[columnKey as keyof Row]}</Table.Cell>
            )}
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};

describe('Table', () => {
  it('should set className', () => {
    const className = 'foo';

    const { container } = render(
      renderComponent({
        className,
      })
    );

    expect(container.firstElementChild).toHaveClass(className);
  });

  it('should set custom style', () => {
    const style = { padding: 20 };

    const { container } = render(
      renderComponent({
        style,
      })
    );

    const firstElement = container.firstChild;

    expect(firstElement).toHaveStyle('padding: 20px');
  });

  it('should accept a ref', () => {
    const ref = createRef<HTMLTableElement>();

    const { container } = render(
      renderComponent({
        ref,
      })
    );

    const table = container.querySelector(`table`);
    expect(ref.current).toBe(table);
  });

  describe('check a single selection mode', () => {
    it('should update selection when a different item is clicked', async () => {
      const onSelectionChange = vi.fn();

      render(
        renderComponent({
          selectionMode: 'single',
          onSelectionChange,
          selectedKeys: [1],
        })
      );

      const first = document.querySelector('[data-key="1"]');
      const second = document.querySelector('[data-key="2"]');

      expect(first).toHaveAttribute('data-selected', 'true');

      if (second) await userEvent.click(second);

      const selection = onSelectionChange.mock.calls?.[0]?.[0];

      expect([...selection]).toEqual([2]);
    });
  });

  describe('check a multiple selection mode', () => {
    it('should update selection when a different item is clicked', async () => {
      const onSelectionChange = vi.fn();

      render(
        renderComponent({
          selectionMode: 'multiple',
          onSelectionChange,
          selectedKeys: [1, 3],
        })
      );

      const first = document.querySelector('[data-key="1"]');
      const second = document.querySelector('[data-key="2"]');
      const third = document.querySelector('[data-key="3"]');

      expect(first).toHaveAttribute('data-selected', 'true');
      expect(third).toHaveAttribute('data-selected', 'true');

      if (second) await userEvent.click(second);

      const selection = onSelectionChange.mock.calls?.[0]?.[0];

      expect([...selection]).toEqual([1, 3, 2]);
    });
  });

  it('should not trigger onSelectionChange when clicking a disabled item', async () => {
    const onSelectionChange = vi.fn();

    render(
      renderComponent({
        selectionMode: 'multiple',
        selectedKeys: [1, 3],
        onSelectionChange,
        disabledKeys: [1],
      })
    );

    const first = document.querySelector('[data-key="1"]');

    if (first) await userEvent.click(first);

    expect(onSelectionChange).toBeCalledTimes(0);
  });
});
