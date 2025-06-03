import { useState } from 'react';

import type { StoryObj } from '@storybook/react';

import { ButtonToggle, ButtonToggleGroup } from '../ButtonToggleGroup';
import { FlexBox } from '../FlexBox';

import { Table } from './index';
import type { TablePropDivider, TableProps } from './types';

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
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  parameters: {
    layout: 'centered',
  },
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
  parameters: {
    layout: 'centered',
  },
  render: (args: TableProps<object>) => (
    <Table aria-label="Libraries" {...args}>
      <Table.Header>
        <Table.Column>Name</Table.Column>
        <Table.Column>URL</Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row href="https://react.dev/" target="_blank">
          <Table.Cell>React</Table.Cell>
          <Table.Cell>https://react.dev/</Table.Cell>
        </Table.Row>
        <Table.Row href="https://www.typescriptlang.org/" target="_blank">
          <Table.Cell>Typescript</Table.Cell>
          <Table.Cell>https://www.typescriptlang.org/</Table.Cell>
        </Table.Row>
        <Table.Row href="https://storybook.js.org/" target="_blank">
          <Table.Cell>Storybook</Table.Cell>
          <Table.Cell>https://storybook.js.org/</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const Divider: Story = {
  parameters: {
    layout: 'centered',
  },
  render: function Render() {
    const [divider, setDivider] = useState<TablePropDivider>('row');

    return (
      <FlexBox gap="l" direction="column">
        <ButtonToggleGroup
          selectedKey={divider}
          onSelectionChange={(key) => setDivider(key as TablePropDivider)}
          fullWidth
          hasEqualItemSize
        >
          <ButtonToggle id="none">None</ButtonToggle>
          <ButtonToggle id="row">Row</ButtonToggle>
        </ButtonToggleGroup>
        <Table
          divider={divider}
          aria-label="Example static collection table"
          style={{ height: '210px', maxWidth: '400px' }}
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
      </FlexBox>
    );
  },
};

export const DynamicCollection: Story = {
  parameters: {
    layout: 'centered',
  },
  render: function Render() {
    type Row = {
      id: number;
      name: string;
      date: string;
      type: string;
    };

    const columns: Array<{ name: string; key: keyof Row }> = [
      { name: 'Name', key: 'name' },
      { name: 'Type', key: 'type' },
      { name: 'Date Modified', key: 'date' },
    ];

    const rows: Row[] = [
      { id: 1, name: 'Games', date: '6/7/2020', type: 'File folder' },
      { id: 2, name: 'Program Files', date: '4/7/2021', type: 'File folder' },
      { id: 3, name: 'bootmgr', date: '11/20/2010', type: 'System file' },
      { id: 4, name: 'log.txt', date: '1/18/2016', type: 'Text Document' },
    ];

    return (
      <Table aria-label="Example dynamic collection table">
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
  },
};

export const FullWidth: Story = {
  render: (args: TableProps<object>) => (
    <Table aria-label="Example static collection table" fullWidth {...args}>
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

export const StickyHeader: Story = {
  render: function Render() {
    const columns = [
      { name: 'User ID', key: 'id' },
      { name: 'First Name', key: 'firstName' },
      { name: 'Last Name', key: 'lastName' },
      { name: 'Email', key: 'email' },
      { name: 'Role', key: 'role' },
    ];

    const users = [
      {
        id: 1,
        firstName: 'Emily',
        lastName: 'Carter',
        email: 'emily.carter@example.com',
        role: 'Admin',
      },
      {
        id: 2,
        firstName: 'Michael',
        lastName: 'Thompson',
        email: 'michael.thompson@mail.com',
        role: 'Editor',
      },
      {
        id: 3,
        firstName: 'Sophia',
        lastName: 'Patel',
        email: 'sophia.patel@example.org',
        role: 'Subscriber',
      },
      {
        id: 4,
        firstName: 'Daniel',
        lastName: 'Nguyen',
        email: 'daniel.nguyen@mail.com',
        role: 'User',
      },
      {
        id: 5,
        firstName: 'Olivia',
        lastName: 'Brooks',
        email: 'olivia.brooks@example.com',
        role: 'Moderator',
      },
      {
        id: 6,
        firstName: 'James',
        lastName: 'Harris',
        email: 'james.harris@mail.org',
        role: 'User',
      },
      {
        id: 7,
        firstName: 'Isabella',
        lastName: 'Murphy',
        email: 'isabella.murphy@mail.com',
        role: 'Subscriber',
      },
      {
        id: 8,
        firstName: 'Benjamin',
        lastName: 'Lee',
        email: 'benjamin.lee@example.com',
        role: 'Editor',
      },
      {
        id: 9,
        firstName: 'Ava',
        lastName: 'Garcia',
        email: 'ava.garcia@mail.com',
        role: 'User',
      },
      {
        id: 10,
        firstName: 'William',
        lastName: 'Martinez',
        email: 'william.martinez@ex.org',
        role: 'Admin',
      },
      {
        id: 11,
        firstName: 'Mia',
        lastName: 'Robinson',
        email: 'mia.robinson@mail.org',
        role: 'Subscriber',
      },
      {
        id: 12,
        firstName: 'Alexander',
        lastName: 'Walker',
        email: 'alex.walker@example.com',
        role: 'User',
      },
      {
        id: 13,
        firstName: 'Charlotte',
        lastName: 'Scott',
        email: 'charlotte.scott@mail.com',
        role: 'Moderator',
      },
      {
        id: 14,
        firstName: 'Henry',
        lastName: 'Adams',
        email: 'henry.adams@example.org',
        role: 'User',
      },
      {
        id: 15,
        firstName: 'Harper',
        lastName: 'Bell',
        email: 'harper.bell@mail.org',
        role: 'Subscriber',
      },
    ];

    return (
      <div
        style={{
          blockSize: 300,
          overflow: 'auto',
        }}
      >
        <Table aria-label="Users" stickyHeader fullWidth>
          <Table.Header columns={columns}>
            {(column) => <Table.Column>{column.name}</Table.Column>}
          </Table.Header>
          <Table.Body items={users}>
            {(item) => (
              <Table.Row>
                {(columnKey) => (
                  <Table.Cell>
                    {item[columnKey as keyof (typeof users)[0]]}
                  </Table.Cell>
                )}
              </Table.Row>
            )}
          </Table.Body>
        </Table>
      </div>
    );
  },
};
