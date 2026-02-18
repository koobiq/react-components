import { useState } from 'react';

import {
  IconPencil16,
  IconSquareMultipleO16,
  IconTrash16,
  IconBoxArchiveArrowDown16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { type Selection, Table, TableContainer } from '../../index';
import type { TableBodyProps } from '../Collections';
import { List } from '../List';
import type { TableProps } from '../Table/types';

import { ActionsPanel, ActionsPanelContainer } from './index';

const meta = {
  title: 'Components/ActionsPanel',
  component: ActionsPanel,
  subcomponents: {
    ActionsPanelContainer,
  },
  argTypes: {},
  tags: ['status:new'],
} satisfies Meta<typeof ActionsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

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
    lastName: 'Bellmont',
    email: 'sophia.bellmont@example.org',
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

const UsersTable = (
  props: TableProps<object> & { users: TableBodyProps<object>['items'] }
) => {
  const columns = [
    { name: 'User ID', key: 'id' },
    { name: 'Name', key: 'firstName' },
    { name: 'Last Name', key: 'lastName' },
    { name: 'Email', key: 'email' },
    { name: 'Role', key: 'role' },
  ];

  return (
    <TableContainer style={{ blockSize: 320, paddingBottom: 80 }}>
      <Table aria-label="The table with users" stickyHeader {...props}>
        <Table.Header columns={columns}>
          {(column) => <Table.Column>{column.name}</Table.Column>}
        </Table.Header>
        <Table.Body items={users}>
          {(item) => (
            <Table.Row>
              {(columnKey) => (
                <Table.Cell>
                  {item[columnKey as keyof (typeof users)[number]]}
                </Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </TableContainer>
  );
};

export const Base: Story = {
  render: function Render(args) {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

    return (
      <ActionsPanelContainer
        style={{
          minWidth: 89,
          maxWidth: '100%',
          overflow: 'hidden',
          resize: 'horizontal',
        }}
      >
        <UsersTable
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          users={users}
        />
        <ActionsPanel
          selectedItemCount={selectedKeys === 'all' ? 'all' : selectedKeys.size}
          onClearSelection={() => {
            setSelectedKeys(new Set());
          }}
          onAction={(key) => alert(`submit ${key} action`)}
          {...args}
        >
          <ActionsPanel.Action key="edit" startIcon={<IconPencil16 />}>
            Edit
          </ActionsPanel.Action>
          <ActionsPanel.Action key="copy" startIcon={<IconSquareMultipleO16 />}>
            Copy
          </ActionsPanel.Action>
          <ActionsPanel.Action
            key="archive"
            startIcon={<IconBoxArchiveArrowDown16 />}
          >
            Archive
          </ActionsPanel.Action>
          <ActionsPanel.Action key="delete" startIcon={<IconTrash16 />}>
            Delete
          </ActionsPanel.Action>
        </ActionsPanel>
      </ActionsPanelContainer>
    );
  },
};

export const Overflow: Story = {
  render: function Render(args) {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(
      new Set(['item-1'])
    );

    return (
      <ActionsPanelContainer
        style={{
          minWidth: 89,
          maxWidth: '100%',
          overflow: 'hidden',
          resize: 'horizontal',
        }}
      >
        <List
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
          aria-label="List with actions panel"
        >
          <List.Item key="item-1">Item 1</List.Item>
          <List.Item key="item-2">Item 2</List.Item>
          <List.Item key="item-3">Item 3</List.Item>
          <List.Item key="item-4">Item 4</List.Item>
          <List.Item key="item-5">Item 5</List.Item>
          <List.Item key="item-6">Item 6</List.Item>
          <List.Item key="item-7">Item 7</List.Item>
          <List.Item key="item-8">Item 8</List.Item>
          <List.Item key="item-9">Item 9</List.Item>
          <List.Item key="item-10">Item 10</List.Item>
        </List>
        <ActionsPanel
          selectedItemCount={selectedKeys === 'all' ? 'all' : selectedKeys.size}
          onClearSelection={() => {
            setSelectedKeys(new Set());
          }}
          onAction={(key) => alert(`submit ${key} action`)}
          {...args}
        >
          <ActionsPanel.Action key="edit" startIcon={<IconPencil16 />}>
            Edit
          </ActionsPanel.Action>
          <ActionsPanel.Action key="copy" startIcon={<IconSquareMultipleO16 />}>
            Copy
          </ActionsPanel.Action>
          <ActionsPanel.Action
            key="archive"
            startIcon={<IconBoxArchiveArrowDown16 />}
          >
            Archive
          </ActionsPanel.Action>
          <ActionsPanel.Action key="delete" startIcon={<IconTrash16 />}>
            Delete
          </ActionsPanel.Action>
        </ActionsPanel>
      </ActionsPanelContainer>
    );
  },
};
