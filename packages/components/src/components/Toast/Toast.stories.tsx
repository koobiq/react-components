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
  tags: ['status:new'],
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      {(state) => (
        <Button
          onPress={() =>
            state.add(
              'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse rerum sed sunt.'
            )
          }
        >
          Show toast
        </Button>
      )}
    </ToastProvider>
  ),
};
