import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

import { Popover } from './index.js';

const meta = {
  title: 'E2E/Popover',
  component: Popover,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof Popover>;

export const Open: Story = {
  render: () => (
    <Popover
      defaultOpen
      control={(props) => <Button {...props}>Block</Button>}
      data-testid="e2eScreenshotTarget"
    >
      <Popover.Header>Block the address?</Popover.Header>
      <Popover.Body>Requests from it will be rejected.</Popover.Body>
      <Popover.Footer>
        <Button>Block</Button>
        <Button variant="fade-contrast-filled">Cancel</Button>
      </Popover.Footer>
    </Popover>
  ),
};
