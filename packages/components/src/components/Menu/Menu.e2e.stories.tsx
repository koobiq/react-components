import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

import { Menu } from './index.js';

const meta = {
  title: 'E2E/Menu',
  component: Menu,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof Menu>;

export const Open: Story = {
  render: () => (
    <Menu
      defaultOpen
      selectionMode="single"
      defaultSelectedKeys={['medium']}
      disabledKeys={['high']}
      control={(props) => <Button {...props}>Filter</Button>}
      data-testid="e2eScreenshotTarget"
    >
      <Menu.Section title="Severity">
        <Menu.Item key="low">Low</Menu.Item>
        <Menu.Item key="medium">Medium</Menu.Item>
        <Menu.Item key="high">High</Menu.Item>
      </Menu.Section>
      <Menu.Divider />
      <Menu.Item key="reset">Reset</Menu.Item>
    </Menu>
  ),
};
