import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

import { Modal } from './index.js';

const meta = {
  title: 'E2E/Modal',
  component: Modal,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Modal>;

export default meta;

type Story = StoryObj<typeof Modal>;

// The dialog fills the modal window, so the test id on it covers the whole window.
export const Open: Story = {
  render: () => (
    <Modal
      defaultOpen
      slotProps={{ dialog: { 'data-testid': 'e2eScreenshotTarget' } }}
    >
      <Modal.Header>Delete the rule?</Modal.Header>
      <Modal.Body>The rule cannot be restored.</Modal.Body>
      <Modal.Footer>
        <Button>Delete</Button>
        <Button variant="fade-contrast-filled">Cancel</Button>
      </Modal.Footer>
    </Modal>
  ),
};
