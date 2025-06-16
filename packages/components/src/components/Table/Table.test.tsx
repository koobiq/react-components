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
    const ref = createRef<HTMLDivElement>();

    const { container } = render(
      renderComponent({
        ref,
      })
    );

    const tagGroup = container.querySelector(`div`);
    expect(ref.current).toBe(tagGroup);
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

      expect([...onSelectionChange.mock.calls[0][0]]).toEqual([2]);
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

      expect([...onSelectionChange.mock.calls[0][0]]).toEqual([1, 3, 2]);
    });
  });
});
