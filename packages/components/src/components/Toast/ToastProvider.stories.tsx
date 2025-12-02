import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';

import { ToastProvider } from './index';
import type { ToastProviderProps } from './index';

const meta = {
  title: 'Components/ToastProvider',
  component: ToastProvider,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
  tags: ['status:new'],
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<ToastProviderProps>;

export const Base: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      {(state) => (
        <Button
          onPress={() =>
            state.add(
              'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse rerum sed sunt.',
              { timeout: 5000 }
            )
          }
        >
          Show toast
        </Button>
      )}
    </ToastProvider>
  ),
};
