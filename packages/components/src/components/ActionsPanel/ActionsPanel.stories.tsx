import { useState } from 'react';

import {
  IconPencil16,
  IconSquareMultipleO16,
  IconTrash16,
  IconBoxArchiveArrowDown16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import {
  Table,
  Button,
  FlexBox,
  ContentPanel,
  TableContainer,
  ContentPanelContainer,
  useBreakpoints,
} from '../../index';
import type { Selection } from '../../index';
import type { TableBodyProps } from '../Collections';
import { List } from '../List';
import type { TableProps } from '../Table/types';

import { ActionsPanel, ActionsPanelContainer } from './index';

const meta = {
  title: 'Components/ActionsPanel',
  component: ActionsPanel,
  subcomponents: {
    ActionsPanelContainer,
    'ActionsPanel.Action': ActionsPanel.Action,
  },
  argTypes: {},
  tags: ['status:new', 'date:2026-02-20'],
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

const content = (
  <FlexBox gap="m" direction="column">
    <span>
      Web security is a crucial aspect of modern digital infrastructure,
      ensuring the protection of sensitive data, user privacy, and system
      integrity. As cyber threats continue to evolve, developers and
      organizations must adopt a proactive approach to securing web applications
      against attacks.
    </span>
    <span>
      One of the most common vulnerabilities is SQL injection, where attackers
      manipulate database queries to gain unauthorized access to sensitive
      information. Similarly, cross-site scripting (XSS) allows malicious
      scripts to run on a victim’s browser, leading to data theft or session
      hijacking. Another prevalent threat is cross-site request forgery (CSRF),
      in which users are tricked into executing unwanted actions on
      authenticated sites. Additionally, man-in-the-middle attacks intercept
      communication between users and servers, compromising the confidentiality
      of data. Distributed Denial-of-Service (DDoS) attacks can also cripple web
      services by overwhelming them with excessive traffic.
    </span>
    <span>
      To mitigate these risks, implementing strong security practices is
      essential. Using HTTPS ensures encrypted communication, protecting data
      from interception. Proper input validation and escaping mechanisms help
      prevent code injection attacks. Authentication and authorization
      mechanisms, including multi-factor authentication (MFA) and role-based
      access control (RBAC), add layers of security to user access. Secure API
      development, including authentication, rate limiting, and encryption,
      reduces vulnerabilities in web services. Keeping software, frameworks, and
      dependencies up to date minimizes the risk of exploiting known
      vulnerabilities. Continuous monitoring, logging, and security audits help
      detect and respond to threats before they cause significant damage.
    </span>
    <span>
      Web security is not a one-time implementation but an ongoing process that
      evolves alongside emerging threats. By following best practices and
      staying vigilant, businesses and developers can build resilient, secure
      applications that protect users and data in an increasingly connected
      world.
    </span>
  </FlexBox>
);

export const Base: Story = {
  render: function Render(args) {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(
      new Set([1, 2, 3])
    );

    return (
      <ActionsPanelContainer>
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
          <ActionsPanel.Action key="edit" icon={<IconPencil16 />}>
            Edit
          </ActionsPanel.Action>
          <ActionsPanel.Action key="copy" icon={<IconSquareMultipleO16 />}>
            Copy
          </ActionsPanel.Action>
          <ActionsPanel.Action
            key="archive"
            icon={<IconBoxArchiveArrowDown16 />}
          >
            Archive
          </ActionsPanel.Action>
          <ActionsPanel.Action key="delete" icon={<IconTrash16 />}>
            Delete
          </ActionsPanel.Action>
        </ActionsPanel>
      </ActionsPanelContainer>
    );
  },
};

export const OverflowActions: Story = {
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
          <ActionsPanel.Action key="edit" icon={<IconPencil16 />}>
            Edit
          </ActionsPanel.Action>
          <ActionsPanel.Action key="copy" icon={<IconSquareMultipleO16 />}>
            Copy
          </ActionsPanel.Action>
          <ActionsPanel.Action
            key="archive"
            icon={<IconBoxArchiveArrowDown16 />}
          >
            Archive
          </ActionsPanel.Action>
          <ActionsPanel.Action key="delete" icon={<IconTrash16 />}>
            Delete
          </ActionsPanel.Action>
        </ActionsPanel>
      </ActionsPanelContainer>
    );
  },
};

export const ExtraCount: Story = {
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
          selectedExtraCount={4}
          selectedItemCount={selectedKeys === 'all' ? 'all' : selectedKeys.size}
          onClearSelection={() => {
            setSelectedKeys(new Set());
          }}
          onAction={(key) => alert(`submit ${key} action`)}
          {...args}
        >
          <ActionsPanel.Action key="edit" icon={<IconPencil16 />}>
            Edit
          </ActionsPanel.Action>
          <ActionsPanel.Action key="copy" icon={<IconSquareMultipleO16 />}>
            Copy
          </ActionsPanel.Action>
          <ActionsPanel.Action
            key="archive"
            icon={<IconBoxArchiveArrowDown16 />}
          >
            Archive
          </ActionsPanel.Action>
          <ActionsPanel.Action key="delete" icon={<IconTrash16 />}>
            Delete
          </ActionsPanel.Action>
        </ActionsPanel>
      </ActionsPanelContainer>
    );
  },
};

export const Standalone: Story = {
  render: function Render(args) {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

    return (
      <>
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
          <ActionsPanel.Action key="edit" icon={<IconPencil16 />}>
            Edit
          </ActionsPanel.Action>
          <ActionsPanel.Action key="copy" icon={<IconSquareMultipleO16 />}>
            Copy
          </ActionsPanel.Action>
          <ActionsPanel.Action
            key="archive"
            icon={<IconBoxArchiveArrowDown16 />}
          >
            Archive
          </ActionsPanel.Action>
          <ActionsPanel.Action key="delete" icon={<IconTrash16 />}>
            Delete
          </ActionsPanel.Action>
        </ActionsPanel>
      </>
    );
  },
};

export const Responsive: Story = {
  render: function Render(args) {
    const { xl } = useBreakpoints();

    const [selectedKeys, setSelectedKeys] = useState<Selection>(
      new Set(['item-1'])
    );

    const onlyIcon = !xl;

    return (
      <ActionsPanelContainer>
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
          <ActionsPanel.Action
            key="edit"
            icon={<IconPencil16 />}
            onlyIcon={onlyIcon}
          >
            Edit
          </ActionsPanel.Action>
          <ActionsPanel.Action
            key="copy"
            icon={<IconSquareMultipleO16 />}
            onlyIcon={onlyIcon}
          >
            Copy
          </ActionsPanel.Action>
          <ActionsPanel.Action
            key="archive"
            icon={<IconBoxArchiveArrowDown16 />}
            onlyIcon={onlyIcon}
          >
            Archive
          </ActionsPanel.Action>
          <ActionsPanel.Action
            key="delete"
            icon={<IconTrash16 />}
            onlyIcon={onlyIcon}
          >
            Delete
          </ActionsPanel.Action>
        </ActionsPanel>
      </ActionsPanelContainer>
    );
  },
};

export const WithContentPanel: Story = {
  render: function Render() {
    const [user, setUser] = useState<(typeof users)[number]>();
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());

    return (
      <ContentPanelContainer>
        {({ open, close, isOpen }) => (
          <>
            <ContentPanel defaultWidth={400} maxWidth="80%" isResizable>
              <ContentPanel.Header>
                {user?.firstName}&nbsp;{user?.lastName}
              </ContentPanel.Header>
              <ContentPanel.Body>{content}</ContentPanel.Body>
              <ContentPanel.Footer>
                <Button onPress={close}>Ok</Button>
              </ContentPanel.Footer>
            </ContentPanel>
            <ActionsPanelContainer>
              <ActionsPanel
                selectedExtraCount={4}
                selectedItemCount={
                  selectedKeys === 'all' ? 'all' : selectedKeys.size
                }
                onClearSelection={() => {
                  setSelectedKeys(new Set());
                }}
                onAction={(key) => alert(`submit ${key} action`)}
              >
                <ActionsPanel.Action key="edit" icon={<IconPencil16 />}>
                  Edit
                </ActionsPanel.Action>
                <ActionsPanel.Action
                  key="copy"
                  icon={<IconSquareMultipleO16 />}
                >
                  Copy
                </ActionsPanel.Action>
                <ActionsPanel.Action
                  key="archive"
                  icon={<IconBoxArchiveArrowDown16 />}
                >
                  Archive
                </ActionsPanel.Action>
                <ActionsPanel.Action key="delete" icon={<IconTrash16 />}>
                  Delete
                </ActionsPanel.Action>
              </ActionsPanel>
              <UsersTable
                users={users}
                selectionMode="multiple"
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                onRowAction={(id) => {
                  setUser(users.find((user) => id === user.id));

                  if (!isOpen) open();
                }}
              />
            </ActionsPanelContainer>
          </>
        )}
      </ContentPanelContainer>
    );
  },
};
