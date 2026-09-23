import {
  IconPencil16,
  IconSquareMultipleO16,
  IconTrash16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { ActionsPanel } from './index.js';

const meta = {
  title: 'E2E/ActionsPanel',
  component: ActionsPanel,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof ActionsPanel>;

export default meta;

type Story = StoryObj<typeof ActionsPanel>;

// The root spans the viewport width, so the test id goes on the visible bar.
export const Open: Story = {
  render: () => (
    <ActionsPanel
      selectedItemCount={3}
      slotProps={{ actions: { 'data-testid': 'e2eScreenshotTarget' } }}
    >
      <ActionsPanel.Action key="edit" icon={<IconPencil16 />}>
        Edit
      </ActionsPanel.Action>
      <ActionsPanel.Action key="copy" icon={<IconSquareMultipleO16 />}>
        Copy
      </ActionsPanel.Action>
      <ActionsPanel.Action key="delete" icon={<IconTrash16 />}>
        Delete
      </ActionsPanel.Action>
    </ActionsPanel>
  ),
};
