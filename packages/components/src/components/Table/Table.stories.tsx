import type { StoryObj } from '@storybook/react';

import { Table } from './index';
import type { TableProps } from './types';

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: TableProps<object>) => (
    <Table
      aria-label="Example static collection table"
      style={{ height: '210px', maxWidth: '400px' }}
      {...args}
    >
      <Table.Header>
        <Table.Column>Name</Table.Column>
        <Table.Column>Type</Table.Column>
        <Table.Column>Date Modified</Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Games</Table.Cell>
          <Table.Cell>File folder</Table.Cell>
          <Table.Cell>6/7/2020</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Program Files</Table.Cell>
          <Table.Cell>File folder</Table.Cell>
          <Table.Cell>4/7/2021</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>bootmgr</Table.Cell>
          <Table.Cell>System file</Table.Cell>
          <Table.Cell>11/20/2010</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>log.txt</Table.Cell>
          <Table.Cell>Text Document</Table.Cell>
          <Table.Cell>1/18/2016</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};
