import { useState } from 'react';

import type { StoryObj } from '@storybook/react';

import { Badge } from '../Badge';
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

const formatDate = (dateString: string): string =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
    new Date(dateString)
  );

export const Base: Story = {
  parameters: {
    layout: 'centered',
  },
  render: (args: TableProps<object>) => (
    <Table
      aria-label="Example static collection table"
      maxBlockSize={400}
      {...args}
    >
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
            <Badge label="Medium" variant="fade-warning" />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Zero-Day Exploits</Table.Cell>
          <Table.Cell>Unknown vulnerabilities exploited immediately</Table.Cell>
          <Table.Cell>
            <Badge label="High" variant="fade-error" />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Insider Threats</Table.Cell>
          <Table.Cell>
            Malicious or careless actions by internal users
          </Table.Cell>
          <Table.Cell>
            <Badge label="Medium–High" variant="fade-error" />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Supply Chain Attack</Table.Cell>
          <Table.Cell>
            Compromise of third-party software or services
          </Table.Cell>
          <Table.Cell>
            <Badge label="High" variant="fade-error" />
          </Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>Denial of Service</Table.Cell>
          <Table.Cell>Flooding resources to disrupt availability</Table.Cell>
          <Table.Cell>
            <Badge label="Low-Medium" variant="fade-contrast" />
          </Table.Cell>
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
          blockSize={210}
          maxBlockSize={410}
        >
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

export const FullWidth: Story = {
  render: (args: TableProps<object>) => (
    <Table aria-label="Example the table with a full width" fullWidth {...args}>
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
      <Table
        aria-label="The table with users"
        blockSize={300}
        stickyHeader
        fullWidth
      >
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
    );
  },
};

export const Alignment: Story = {
  parameters: {
    layout: 'centered',
  },
  render: (args: TableProps<object>) => (
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

export const SingleSelection: Story = {
  parameters: {
    layout: 'centered',
  },
  render: (args: TableProps<object>) => (
    <Table aria-label="Table with selection" selectionMode="single" {...args}>
      <Table.Header>
        <Table.Column>Name</Table.Column>
        <Table.Column>Type</Table.Column>
        <Table.Column>Level</Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row key="1">
          <Table.Cell>Charizard</Table.Cell>
          <Table.Cell>Fire, Flying</Table.Cell>
          <Table.Cell>67</Table.Cell>
        </Table.Row>
        <Table.Row key="2">
          <Table.Cell>Blastoise</Table.Cell>
          <Table.Cell>Water</Table.Cell>
          <Table.Cell>56</Table.Cell>
        </Table.Row>
        <Table.Row key="3">
          <Table.Cell>Venusaur</Table.Cell>
          <Table.Cell>Grass, Poison</Table.Cell>
          <Table.Cell>83</Table.Cell>
        </Table.Row>
        <Table.Row key="4">
          <Table.Cell>Pikachu</Table.Cell>
          <Table.Cell>Electric</Table.Cell>
          <Table.Cell>100</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};

export const MultiSelection: Story = {
  parameters: {
    layout: 'centered',
  },
  render: (args: TableProps<object>) => (
    <Table aria-label="Table with selection" selectionMode="multiple" {...args}>
      <Table.Header>
        <Table.Column>Name</Table.Column>
        <Table.Column>Type</Table.Column>
        <Table.Column>Level</Table.Column>
      </Table.Header>
      <Table.Body>
        <Table.Row key="1">
          <Table.Cell>Charizard</Table.Cell>
          <Table.Cell>Fire, Flying</Table.Cell>
          <Table.Cell>67</Table.Cell>
        </Table.Row>
        <Table.Row key="2">
          <Table.Cell>Blastoise</Table.Cell>
          <Table.Cell>Water</Table.Cell>
          <Table.Cell>56</Table.Cell>
        </Table.Row>
        <Table.Row key="3">
          <Table.Cell>Venusaur</Table.Cell>
          <Table.Cell>Grass, Poison</Table.Cell>
          <Table.Cell>83</Table.Cell>
        </Table.Row>
        <Table.Row key="4">
          <Table.Cell>Pikachu</Table.Cell>
          <Table.Cell>Electric</Table.Cell>
          <Table.Cell>100</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  ),
};
