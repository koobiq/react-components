import type { Meta, StoryObj } from '@storybook/react';

import { Select } from './index.js';

const meta = {
  title: 'E2E/Select',
  component: Select,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof Select>;

export const Open: Story = {
  render: () => (
    <Select
      aria-label="Attack type"
      defaultOpen
      defaultSelectedKeys={['ddos']}
      style={{ inlineSize: 200 }}
      slotProps={{ popover: { 'data-testid': 'e2eScreenshotTarget' } }}
    >
      <Select.Item key="bruteforce">Bruteforce</Select.Item>
      <Select.Item key="ddos">DDoS</Select.Item>
      <Select.Item key="dos">DoS</Select.Item>
    </Select>
  ),
};
