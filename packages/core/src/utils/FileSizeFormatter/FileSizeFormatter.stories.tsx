import { Table, TableContainer } from '@koobiq/react-components';
import type { Meta, StoryObj } from '@storybook/react';

import { FileSizeFormatter } from './FileSizeFormatter';

const meta = {
  title: 'Utilities/FileSizeFormatter',
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;

type Story = StoryObj;

const values = [512, 1000, 1024, 1_000_000, 1024 ** 2];

type FormatRow = { id: number } & Record<string, string | number>;

const FormatsTable = ({
  formatters,
}: {
  formatters: Array<{ name: string; formatter: FileSizeFormatter }>;
}) => {
  const columns = [
    { id: 'bytes', name: 'Bytes' },
    ...formatters.map(({ name }, index) => ({
      id: `format-${index}`,
      name,
    })),
  ];

  const items: FormatRow[] = values.map((value) => ({
    id: value,
    bytes: value,
    ...Object.fromEntries(
      formatters.map(({ formatter }, index) => [
        `format-${index}`,
        formatter.format(value),
      ])
    ),
  }));

  return (
    <TableContainer>
      <Table aria-label="File size formatter" divider="row" fullWidth>
        <Table.Header columns={columns}>
          {(column) => <Table.Column>{column.name}</Table.Column>}
        </Table.Header>
        <Table.Body items={items}>
          {(item) => (
            <Table.Row>
              {(columnKey) => (
                <Table.Cell>{item[String(columnKey)]}</Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </TableContainer>
  );
};

export const Base: Story = {
  render: () => (
    <FormatsTable
      formatters={[
        { name: 'SI', formatter: new FileSizeFormatter('en-US') },
        {
          name: 'IEC',
          formatter: new FileSizeFormatter('en-US', {
            defaultUnitSystem: 'IEC',
          }),
        },
      ]}
    />
  ),
};

export const Localization: Story = {
  render: () => (
    <FormatsTable
      formatters={[
        { name: 'en-US', formatter: new FileSizeFormatter('en-US') },
        { name: 'ru-RU', formatter: new FileSizeFormatter('ru-RU') },
      ]}
    />
  ),
};
