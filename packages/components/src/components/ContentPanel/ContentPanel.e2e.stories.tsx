import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

import { ContentPanel, ContentPanelContainer } from './index.js';

const meta = {
  title: 'E2E/ContentPanel',
  component: ContentPanel,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof ContentPanel>;

export default meta;

type Story = StoryObj<typeof ContentPanel>;

// The dialog fills the panel, so the test id on it covers the whole panel.
export const Open: Story = {
  render: () => (
    <ContentPanelContainer
      defaultOpen
      style={{ inlineSize: 480, blockSize: 240 }}
    >
      <ContentPanel
        slotProps={{ dialog: { 'data-testid': 'e2eScreenshotTarget' } }}
      >
        <ContentPanel.Header>Title</ContentPanel.Header>
        <ContentPanel.Body>The scan has finished.</ContentPanel.Body>
        <ContentPanel.Footer>
          <Button>Action</Button>
        </ContentPanel.Footer>
      </ContentPanel>
    </ContentPanelContainer>
  ),
};
