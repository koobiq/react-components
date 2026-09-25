import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

import { Tooltip } from './index.js';

const meta = {
  title: 'E2E/Tooltip',
  component: Tooltip,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof Tooltip>;

export const Open: Story = {
  render: () => (
    <Tooltip
      defaultOpen
      control={(props) => <Button {...props}>Status</Button>}
      data-testid="e2eScreenshotTarget"
    >
      Blocked by the firewall
    </Tooltip>
  ),
};
