import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import s from './components/TableRow/TableRow.module.css';
import { Table } from './index.js';

const meta = {
  title: 'E2E/Table',
  component: Table,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof Table>;

type State = { title: string; className?: string };

// React Aria sets hover, press and focus only on interaction, so their classes are forced.
const states: State[] = [
  { title: 'normal' },
  { title: 'hover', className: s.hovered },
  { title: 'active', className: s.pressed },
  { title: 'focus', className: s.focusVisible },
  { title: 'selected' },
  { title: 'disabled' },
];

export const State: Story = {
  render: () => (
    <E2eGrid columns={1}>
      <Table
        aria-label="Row states"
        selectionMode="single"
        defaultSelectedKeys={['selected']}
        disabledKeys={['disabled']}
        disabledBehavior="all"
      >
        <Table.Header>
          <Table.Column>State</Table.Column>
          <Table.Column>Host</Table.Column>
          <Table.Column>Status</Table.Column>
        </Table.Header>
        <Table.Body>
          {states.map(({ title, className }) => (
            <Table.Row key={title} className={className}>
              <Table.Cell>{title}</Table.Cell>
              <Table.Cell>10.0.0.1</Table.Cell>
              <Table.Cell>Online</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </E2eGrid>
  ),
};
