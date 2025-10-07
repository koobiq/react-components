import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import type { Selection } from '../../index';
import { Badge } from '../Badge';
import { ButtonToggle, ButtonToggleGroup } from '../ButtonToggleGroup';
import { FlexBox } from '../FlexBox';

import { Table, TableContainer } from './index';
import type { TablePropDivider, TableProps } from './types';

const meta = {
  title: 'Components/Table',
  component: Table,
  subcomponents: {
    TableContainer,
    'Table.Header': Table.Header,
    'Table.Body': Table.Body,
    'Table.Column': Table.Column,
    'Table.Row': Table.Row,
    'Table.Cell': Table.Cell,
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['status:updated'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const formatDate = (dateString: string): string =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
    new Date(dateString)
  );

export const Base: Story = {
  render: (args) => (
    <TableContainer maxBlockSize={400}>
      <Table aria-label="Example static collection table" {...args}>
        <Table.Header>
          <Table.Column>Threat Category</Table.Column>
          <Table.Column>Description</Table.Column>
          <Table.Column>Risk Level</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Social Engineering</Table.Cell>
            <Table.Cell>Manipulation of individuals to gain access</Table.Cell>
            <Table.Cell>
              <Badge variant="fade-warning">Medium</Badge>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Zero-Day Exploits</Table.Cell>
            <Table.Cell>
              Unknown vulnerabilities exploited immediately
            </Table.Cell>
            <Table.Cell>
              <Badge variant="fade-error">High</Badge>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Insider Threats</Table.Cell>
            <Table.Cell>
              Malicious or careless actions by internal users
            </Table.Cell>
            <Table.Cell>
              <Badge variant="fade-error">Medium–High</Badge>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Supply Chain Attack</Table.Cell>
            <Table.Cell>
              Compromise of third-party software or services
            </Table.Cell>
            <Table.Cell>
              <Badge variant="fade-error">High</Badge>
            </Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Denial of Service</Table.Cell>
            <Table.Cell>Flooding resources to disrupt availability</Table.Cell>
            <Table.Cell>
              <Badge variant="fade-contrast">Low-Medium</Badge>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </TableContainer>
  ),
};

export const Links: Story = {
  render: (args) => (
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
  render: function Render() {
    const [divider, setDivider] = useState<TablePropDivider>('row');

    return (
      <FlexBox gap="l" direction="column">
        <ButtonToggleGroup
          selectedKey={divider}
          onSelectionChange={(key) => setDivider(key as TablePropDivider)}
          hasEqualItemSize
          fullWidth
        >
          <ButtonToggle id="none">None</ButtonToggle>
          <ButtonToggle id="row">Row</ButtonToggle>
        </ButtonToggleGroup>
        <Table divider={divider} aria-label="Example static collection table">
          <Table.Header>
            <Table.Column>Name</Table.Column>
            <Table.Column>Type</Table.Column>
            <Table.Column>Date Modified</Table.Column>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>home</Table.Cell>
              <Table.Cell>File folder</Table.Cell>
              <Table.Cell>{formatDate('2024-06-07')}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>etc</Table.Cell>
              <Table.Cell>File folder</Table.Cell>
              <Table.Cell>{formatDate('2023-04-07')}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>vmlinuz</Table.Cell>
              <Table.Cell>System file</Table.Cell>
              <Table.Cell>{formatDate('2015-11-20')}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>log.txt</Table.Cell>
              <Table.Cell>Text file</Table.Cell>
              <Table.Cell>{formatDate('2019-01-18')}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </FlexBox>
    );
  },
};

export const DynamicCollection: Story = {
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
      {
        id: 1,
        name: 'home',
        type: 'File folder',
        date: formatDate('2024-06-07'),
      },
      {
        id: 2,
        name: 'etc',
        type: 'File folder',
        date: formatDate('2023-04-07'),
      },
      {
        id: 3,
        name: 'vmlinuz',
        type: 'System file',
        date: formatDate('2015-11-20'),
      },
      {
        id: 4,
        name: 'log.txt',
        type: 'Text file',
        date: formatDate('2019-01-18'),
      },
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

export const StickyHeader: Story = {
  parameters: {
    layout: 'padded',
  },
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

    return (
      <TableContainer blockSize={300}>
        <Table aria-label="The table with users" stickyHeader>
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
      </TableContainer>
    );
  },
};

export const Alignment: Story = {
  render: (args) => (
    <Table aria-label="Alignment" {...args}>
      <Table.Header>
        <Table.Column align="center">Name</Table.Column>
        <Table.Column align="center">Type</Table.Column>
        <Table.Column align="center">Date Modified</Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell align="center">home</Table.Cell>
          <Table.Cell align="center">File folder</Table.Cell>
          <Table.Cell align="center">{formatDate('2024-06-07')}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell align="center">etc</Table.Cell>
          <Table.Cell align="center">File folder</Table.Cell>
          <Table.Cell align="center">{formatDate('2023-04-07')}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell align="center">vmlinuz</Table.Cell>
          <Table.Cell align="center">System file</Table.Cell>
          <Table.Cell align="center">{formatDate('2015-11-20')}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell align="center">log.txt</Table.Cell>
          <Table.Cell align="center">Text file</Table.Cell>
          <Table.Cell align="center">{formatDate('2019-01-18')}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: (args) => (
    <Table aria-label="Alignment" fullWidth {...args}>
      <Table.Header>
        <Table.Column align="center">Name</Table.Column>
        <Table.Column align="center">Type</Table.Column>
        <Table.Column align="center">Date Modified</Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell align="center">home</Table.Cell>
          <Table.Cell align="center">File folder</Table.Cell>
          <Table.Cell align="center">{formatDate('2024-06-07')}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell align="center">etc</Table.Cell>
          <Table.Cell align="center">File folder</Table.Cell>
          <Table.Cell align="center">{formatDate('2023-04-07')}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell align="center">vmlinuz</Table.Cell>
          <Table.Cell align="center">System file</Table.Cell>
          <Table.Cell align="center">{formatDate('2015-11-20')}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell align="center">log.txt</Table.Cell>
          <Table.Cell align="center">Text file</Table.Cell>
          <Table.Cell align="center">{formatDate('2019-01-18')}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

const LanguageTable = (props: TableProps<unknown>) => {
  const columns = [
    { name: 'ID', uid: 'id' },
    { name: 'Language', uid: 'language' },
    { name: 'Paradigm', uid: 'paradigm' },
    { name: 'First Appeared', uid: 'firstAppeared' },
  ];

  const rows = [
    {
      id: 1,
      language: 'Python',
      paradigm: 'Multi-paradigm',
      firstAppeared: '1991',
    },
    {
      id: 2,
      language: 'JavaScript',
      paradigm: 'Multi-paradigm',
      firstAppeared: '1995',
    },
    {
      id: 3,
      language: 'Rust',
      paradigm: 'Multi-paradigm',
      firstAppeared: '2010',
    },
    {
      id: 4,
      language: 'Go',
      paradigm: 'Concurrent, Imperative',
      firstAppeared: '2009',
    },
    {
      id: 5,
      language: 'TypeScript',
      paradigm: 'Multi-paradigm',
      firstAppeared: '2012',
    },
    {
      id: 6,
      language: 'Kotlin',
      paradigm: 'Object-oriented, Functional',
      firstAppeared: '2011',
    },
  ];

  return (
    <Table {...props}>
      <Table.Header columns={columns}>
        {(column) => (
          <Table.Column key={column.uid}>{column.name}</Table.Column>
        )}
      </Table.Header>
      <Table.Body items={rows}>
        {(item) => (
          <Table.Row>
            {(columnKey) => (
              <Table.Cell>
                {item[columnKey as keyof (typeof rows)[0]]}
              </Table.Cell>
            )}
          </Table.Row>
        )}
      </Table.Body>
    </Table>
  );
};

export const SingleSelection: Story = {
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <LanguageTable
      aria-label="Table with selection"
      defaultSelectedKeys={[2]}
      selectionMode="single"
      {...args}
    />
  ),
};

export const MultiSelection: Story = {
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <LanguageTable
      aria-label="Table with selection"
      selectionMode="multiple"
      {...args}
    />
  ),
};

export const SelectionBehavior: Story = {
  parameters: {
    layout: 'centered',
  },
  render: function Render() {
    return (
      <LanguageTable
        aria-label="Table with selection"
        selectionMode="multiple"
        selectionBehavior="replace"
      />
    );
  },
};

export const ControlledSelection: Story = {
  render: function Render() {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([2]));

    return (
      <LanguageTable
        aria-label="Table with controlled selection"
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
      />
    );
  },
};

export const DisabledRows: Story = {
  render: function Render() {
    return (
      <LanguageTable
        aria-label="Table with disabled rows"
        selectionMode="multiple"
        disabledBehavior="all"
        disabledKeys={[3, 4]}
        defaultSelectedKeys={[3]}
      />
    );
  },
};

export const RowActions: Story = {
  render: function Render() {
    return (
      <LanguageTable
        aria-label="Table with row actions"
        selectionMode="multiple"
        onRowAction={(key) => alert(`Opening item ${key}...`)}
      />
    );
  },
};
