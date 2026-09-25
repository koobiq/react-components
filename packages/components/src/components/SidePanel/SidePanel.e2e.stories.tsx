import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

import { SidePanel } from './index.js';

const meta = {
  title: 'E2E/SidePanel',
  component: SidePanel,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof SidePanel>;

export default meta;

type Story = StoryObj<typeof SidePanel>;

// The dialog fills the panel, so the test id on it covers the whole panel.
export const Open: Story = {
  render: () => (
    <SidePanel
      defaultOpen
      size="small"
      slotProps={{ dialog: { 'data-testid': 'e2eScreenshotTarget' } }}
    >
      <SidePanel.Header>Rule details</SidePanel.Header>
      <SidePanel.Body>The rule applies to all sensors.</SidePanel.Body>
      <SidePanel.Footer>
        <Button>Save</Button>
        <Button variant="fade-contrast-filled">Cancel</Button>
      </SidePanel.Footer>
    </SidePanel>
  ),
};
