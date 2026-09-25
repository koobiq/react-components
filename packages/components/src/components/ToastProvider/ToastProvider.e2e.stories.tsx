import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

import { ToastProvider, toast, toastPropStatus } from './index.js';

const meta = {
  title: 'E2E/ToastProvider',
  component: ToastProvider,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof ToastProvider>;

export default meta;

type Story = StoryObj<typeof ToastProvider>;

// The decorator closes all toasts on mount, so they are added on press.
export const Status: Story = {
  render: () => (
    <Button
      onPress={() =>
        toastPropStatus.forEach((status) =>
          toast.add({
            title: status,
            caption: 'Caption',
            status,
            timeout: Infinity,
          })
        )
      }
    >
      Show toasts
    </Button>
  ),
};
