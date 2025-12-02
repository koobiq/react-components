import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';

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
            state.add({
              title: 'Message',
              description:
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse rerum sed sunt.',
              status: 'success',
            })
          }
          variant="fade-contrast-filled"
        >
          Show toast
        </Button>
      )}
    </ToastProvider>
  ),
};

export const Status: Story = {
  render: (args) => (
    <ToastProvider {...args}>
      {(state) => (
        <FlexBox gap="m">
          <Button
            onPress={() =>
              state.add({
                title: 'Info',
                description:
                  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse rerum sed sunt.',
                status: 'info',
              })
            }
            variant="fade-contrast-filled"
          >
            Info
          </Button>
          <Button
            onPress={() =>
              state.add({
                title: 'Success',
                description:
                  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse rerum sed sunt.',
                status: 'success',
              })
            }
            variant="fade-contrast-filled"
          >
            Success
          </Button>
          <Button
            onPress={() =>
              state.add({
                title: 'Warning',
                description:
                  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse rerum sed sunt.',
                status: 'warning',
              })
            }
            variant="fade-contrast-filled"
          >
            Warning
          </Button>
          <Button
            onPress={() =>
              state.add({
                title: 'Error',
                description:
                  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse rerum sed sunt.',
                status: 'error',
              })
            }
            variant="fade-contrast-filled"
          >
            Error
          </Button>
        </FlexBox>
      )}
    </ToastProvider>
  ),
};
