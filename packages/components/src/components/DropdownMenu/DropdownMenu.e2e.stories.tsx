import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Divider } from '../Divider';

import { DropdownMenu } from './index.js';

const meta = {
  title: 'E2E/DropdownMenu',
  component: DropdownMenu,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof DropdownMenu>;

export const Open: Story = {
  render: () => (
    <DropdownMenu defaultOpen>
      <Button>Filter</Button>
      <DropdownMenu.Popover data-testid="e2eScreenshotTarget">
        <DropdownMenu.Content
          selectionMode="single"
          defaultSelectedKeys={['medium']}
          disabledKeys={['high']}
        >
          <DropdownMenu.Section title="Severity">
            <DropdownMenu.Item id="low">Low</DropdownMenu.Item>
            <DropdownMenu.Item id="medium">Medium</DropdownMenu.Item>
            <DropdownMenu.Item id="high">High</DropdownMenu.Item>
          </DropdownMenu.Section>
          <Divider />
          <DropdownMenu.Item id="reset">Reset</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Popover>
    </DropdownMenu>
  ),
};
