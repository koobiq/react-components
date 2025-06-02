import type { StoryObj } from '@storybook/react';

import { Table } from './index';
import type { TableProps } from './types';

const meta = {
  title: 'Components/Table',
  component: Table,
  subcomponents: {
    'Table.Header': Table.Header,
    'Table.Body': Table.Body,
    'Table.Column': Table.Column,
    'Table.Row': Table.Row,
    'Table.Cell': Table.Cell,
  },
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
          <Table.Cell>06/07/2024</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Program Files</Table.Cell>
          <Table.Cell>File folder</Table.Cell>
          <Table.Cell>04/07/2023</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>bootmgr</Table.Cell>
          <Table.Cell>System file</Table.Cell>
          <Table.Cell>11/20/2015</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>log.txt</Table.Cell>
          <Table.Cell>Text Document</Table.Cell>
          <Table.Cell>01/18/2019</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const Links: Story = {
  render: (args: TableProps<object>) => (
    <Table aria-label="Bookmarks" {...args}>
      <Table.Header>
        <Table.Column>Name</Table.Column>
        <Table.Column>URL</Table.Column>
        <Table.Column>Date added</Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row href="https://adobe.com/" target="_blank">
          <Table.Cell>Adobe</Table.Cell>
          <Table.Cell>https://adobe.com/</Table.Cell>
          <Table.Cell>January 28, 2023</Table.Cell>
        </Table.Row>
        <Table.Row href="https://google.com/" target="_blank">
          <Table.Cell>Google</Table.Cell>
          <Table.Cell>https://google.com/</Table.Cell>
          <Table.Cell>April 5, 2023</Table.Cell>
        </Table.Row>
        <Table.Row href="https://nytimes.com/" target="_blank">
          <Table.Cell>New York Times</Table.Cell>
          <Table.Cell>https://nytimes.com/</Table.Cell>
          <Table.Cell>July 12, 2023</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};
