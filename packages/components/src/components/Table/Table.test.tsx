import { createRef } from 'react';

import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

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
        {(column) => <Table.Column>{column.name}</Table.Column>}
      </Table.Header>
      <Table.Body items={rows}>
        {(item) => (
          <Table.Row key={item.id}>
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
});
