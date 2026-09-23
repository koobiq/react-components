import { IconCircle16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { List } from './index.js';

const meta = {
  title: 'E2E/List',
  component: List,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof List>;

export default meta;

type Story = StoryObj<typeof List>;

// Hover, press and focus come from React Aria as data attributes, so only the states set by props.
export const State: Story = {
  render: () => (
    <E2eGrid columns={2}>
      {(['single', 'multiple'] as const).map((selectionMode) => (
        <List
          key={selectionMode}
          aria-label={selectionMode}
          selectionMode={selectionMode}
          defaultSelectedKeys={['selected']}
          disabledKeys={['disabled']}
          style={{ inlineSize: 240 }}
        >
          <List.Item key="normal">normal</List.Item>
          <List.Item key="selected">selected</List.Item>
          <List.Item key="disabled">disabled</List.Item>
          <List.Item key="addon" textValue="with addon">
            <List.ItemAddon>
              <IconCircle16 />
            </List.ItemAddon>
            <List.ItemText caption="caption">with addon</List.ItemText>
          </List.Item>
        </List>
      ))}
    </E2eGrid>
  ),
};
