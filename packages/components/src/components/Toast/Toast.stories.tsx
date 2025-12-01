import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

import { ToastProvider } from './index';

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => (
    <ToastProvider>
      {(state) => (
        <Button onPress={() => state.add('Toast is done!')}>Show toast</Button>
      )}
    </ToastProvider>
  ),
};
