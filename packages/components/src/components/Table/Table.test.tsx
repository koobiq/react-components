import { createRef, useMemo, useState } from 'react';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import { Provider } from '../Provider';

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

    expect(firstElement).toHaveStyle({ padding: '20px' });
  });

  it('should invalidate dynamic rows when Table.Body props change', () => {
    const rows = [{ id: 1, name: 'home' }];
    const renderRow = vi.fn();

    const ConditionalTable = ({
      isHighlighted,
    }: {
      isHighlighted: boolean;
    }) => (
      <Table aria-label="Conditional row class">
        <Table.Header>
          <Table.Column>Name</Table.Column>
        </Table.Header>
        <Table.Body items={rows}>
          {(item) => {
            renderRow();

            return (
              <Table.Row
                className={isHighlighted ? 'highlighted' : undefined}
                data-testid="row"
              >
                <Table.Cell>{item.name}</Table.Cell>
              </Table.Row>
            );
          }}
        </Table.Body>
      </Table>
    );

    const { rerender } = render(<ConditionalTable isHighlighted={false} />);

    expect(screen.getByTestId('row')).not.toHaveClass('highlighted');
    expect(renderRow).toHaveBeenCalledTimes(1);

    rerender(<ConditionalTable isHighlighted={false} />);

    expect(renderRow).toHaveBeenCalledTimes(2);

    rerender(<ConditionalTable isHighlighted />);

    expect(screen.getByTestId('row')).toHaveClass('highlighted');
    expect(renderRow).toHaveBeenCalledTimes(3);

    rerender(<ConditionalTable isHighlighted={false} />);

    expect(screen.getByTestId('row')).not.toHaveClass('highlighted');
    expect(renderRow).toHaveBeenCalledTimes(4);
  });

  it('should invalidate dynamic columns when Table.Header props change', () => {
    const columns = [{ key: 'name', name: 'Name' }];
    const rows = [{ id: 1, name: 'home' }];

    const ConditionalTable = ({
      isHighlighted,
    }: {
      isHighlighted: boolean;
    }) => (
      <Table aria-label="Conditional column class">
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column
              key={column.key}
              className={isHighlighted ? 'highlighted' : undefined}
            >
              {column.name}
            </Table.Column>
          )}
        </Table.Header>
        <Table.Body items={rows}>
          {(item) => (
            <Table.Row>
              <Table.Cell>{item.name}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );

    const { rerender } = render(<ConditionalTable isHighlighted={false} />);
    const column = screen.getByRole('columnheader');

    expect(column).not.toHaveClass('highlighted');

    rerender(<ConditionalTable isHighlighted />);

    expect(column).toHaveClass('highlighted');

    rerender(<ConditionalTable isHighlighted={false} />);

    expect(column).not.toHaveClass('highlighted');
  });

  it('should preserve selection when rebuilding the collection', async () => {
    const rows = [{ id: 1, name: 'home' }];

    const SelectableTable = ({ isHighlighted }: { isHighlighted: boolean }) => (
      <Table aria-label="Selectable table" selectionMode="single">
        <Table.Header>
          <Table.Column>Name</Table.Column>
        </Table.Header>
        <Table.Body items={rows}>
          {(item) => (
            <Table.Row
              className={isHighlighted ? 'highlighted' : undefined}
              data-testid="selectable-row"
            >
              <Table.Cell>{item.name}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );

    const { rerender } = render(<SelectableTable isHighlighted={false} />);
    const row = screen.getByTestId('selectable-row');

    await userEvent.click(row);

    expect(row).toHaveAttribute('data-selected', 'true');

    rerender(<SelectableTable isHighlighted />);

    expect(screen.getByTestId('selectable-row')).toHaveAttribute(
      'data-selected',
      'true'
    );

    expect(screen.getByTestId('selectable-row')).toHaveClass('highlighted');
  });

  it('should preserve sorting when rebuilding the collection', async () => {
    type Row = { id: number; name: string };

    const rows: Row[] = [
      { id: 1, name: 'Beta' },
      { id: 2, name: 'Alpha' },
    ];

    const SortableTable = ({ isHighlighted }: { isHighlighted: boolean }) => {
      const [sortDescriptor, setSortDescriptor] =
        useState<TableProps<Row>['sortDescriptor']>();

      const sortedRows = useMemo(() => {
        if (!sortDescriptor) return rows;

        const direction = sortDescriptor.direction === 'ascending' ? 1 : -1;

        return [...rows].sort(
          (a, b) => a.name.localeCompare(b.name) * direction
        );
      }, [sortDescriptor]);

      return (
        <Table
          aria-label="Sortable collection"
          sortDescriptor={sortDescriptor}
          onSortChange={(descriptor) => setSortDescriptor(descriptor)}
        >
          <Table.Header>
            <Table.Column key="name" allowsSorting>
              Name
            </Table.Column>
          </Table.Header>
          <Table.Body items={sortedRows}>
            {(item) => (
              <Table.Row className={isHighlighted ? 'highlighted' : undefined}>
                <Table.Cell>{item.name}</Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      );
    };

    const getRowNames = () =>
      screen
        .getAllByRole('row')
        .slice(1)
        .map((row) => row.textContent);

    const { rerender } = render(<SortableTable isHighlighted={false} />);

    await userEvent.click(screen.getByRole('columnheader', { name: 'Name' }));

    expect(getRowNames()).toEqual(['Alpha', 'Beta']);

    rerender(<SortableTable isHighlighted />);

    expect(getRowNames()).toEqual(['Alpha', 'Beta']);
    expect(screen.getAllByRole('row')[1]).toHaveClass('highlighted');

    await userEvent.click(screen.getByRole('columnheader', { name: 'Name' }));

    expect(getRowNames()).toEqual(['Beta', 'Alpha']);
  });

  it('should preserve resized column width when rebuilding the collection', async () => {
    const columns = [{ key: 'name', name: 'Name' }];
    const rows = [{ id: 1, name: 'Alpha' }];

    const ResizableTable = ({ isHighlighted }: { isHighlighted: boolean }) => (
      <Table aria-label="Resizable collection" isResizable>
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column
              key={column.key}
              allowsResizing
              defaultWidth={200}
              className={isHighlighted ? 'highlighted' : undefined}
            >
              {column.name}
            </Table.Column>
          )}
        </Table.Header>
        <Table.Body items={rows}>
          {(item) => (
            <Table.Row>
              <Table.Cell>{item.name}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );

    const { rerender } = render(<ResizableTable isHighlighted={false} />);
    const initialWidth = screen.getByRole('columnheader').style.inlineSize;
    const resizer = screen.getByRole('slider');

    resizer.focus();
    await userEvent.keyboard('{Enter}{ArrowRight}{Enter}');

    const resizedWidth = screen.getByRole('columnheader').style.inlineSize;

    expect(resizedWidth).not.toBe(initialWidth);

    rerender(<ResizableTable isHighlighted />);

    expect(screen.getByRole('columnheader').style.inlineSize).toBe(
      resizedWidth
    );

    expect(screen.getByRole('columnheader')).toHaveClass('highlighted');
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

    it('should hide the header select all checkbox when configured', () => {
      render(
        renderComponent({
          selectionMode: 'multiple',
          hideSelectAll: true,
        })
      );

      expect(screen.getAllByRole('checkbox')).toHaveLength(4);
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
        <Table aria-label="Libraries">
          <Table.Header>
            <Table.Column>Name</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row href="/test" data-testid="link">
              <Table.Cell>Foo</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </Provider>
    );

    await userEvent.click(screen.getByTestId('link'));

    expect(onNavigate).toBeCalled();
  });

  it('should pass unsorted state to renderSortIcon for sortable column', () => {
    const renderSortIcon = vi.fn(() => <span data-testid="sort-icon" />);

    render(
      <Table aria-label="Sortable table" renderSortIcon={renderSortIcon}>
        <Table.Header>
          <Table.Column key="name" allowsSorting>
            Name
          </Table.Column>
        </Table.Header>
        <Table.Body items={[{ id: 1, name: 'home' }]}>
          {(item) => (
            <Table.Row>
              <Table.Cell>{item.name}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );

    expect(renderSortIcon).toBeCalledWith({
      direction: undefined,
      isActive: false,
    });

    const sortIcon = screen.getByTestId('sort-icon').parentElement;

    expect(sortIcon).toHaveAttribute('data-slot', 'sort-icon');
    expect(sortIcon).not.toHaveAttribute('data-sort-direction');
  });

  it('should pass active sort direction to renderSortIcon', () => {
    const renderSortIcon = vi.fn(() => <span data-testid="sort-icon" />);

    render(
      <Table
        aria-label="Sortable table"
        sortDescriptor={{ column: 'name', direction: 'ascending' }}
        renderSortIcon={renderSortIcon}
      >
        <Table.Header>
          <Table.Column key="name" allowsSorting>
            Name
          </Table.Column>
        </Table.Header>
        <Table.Body items={[{ id: 1, name: 'home' }]}>
          {(item) => (
            <Table.Row>
              <Table.Cell>{item.name}</Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    );

    expect(renderSortIcon).toBeCalledWith({
      direction: 'ascending',
      isActive: true,
    });

    expect(screen.getByTestId('sort-icon').parentElement).toHaveAttribute(
      'data-sort-direction',
      'ascending'
    );
  });
});
