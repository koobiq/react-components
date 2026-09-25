import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

import { Dialog } from './index.js';

const meta = {
  title: 'E2E/Dialog',
  component: Dialog,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof Dialog>;

export const Base: Story = {
  render: () => (
    <Dialog data-testid="e2eScreenshotTarget" style={{ inlineSize: 400 }}>
      <Dialog.Header>Title</Dialog.Header>
      <Dialog.Body>The scan has finished.</Dialog.Body>
      <Dialog.Footer>
        <Button>Action</Button>
      </Dialog.Footer>
    </Dialog>
  ),
};
