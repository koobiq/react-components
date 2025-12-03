import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Link } from '../Link';

import { ToastProvider, toast } from './index';
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
    <>
      <ToastProvider {...args} />
      <Button
        onPress={() =>
          toast.add({
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
    </>
  ),
};

export const Status: Story = {
  render: () => (
    <>
      <FlexBox gap="m">
        <Button
          onPress={() =>
            toast.add({
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
            toast.add({
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
            toast.add({
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
            toast.add({
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
    </>
  ),
};

export const AutoDismiss: Story = {
  render: () => (
    <>
      <Button
        onPress={() =>
          toast.add({
            title: 'Message',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse rerum sed sunt.',
            status: 'success',
            timeout: 5000,
          })
        }
        variant="fade-contrast-filled"
      >
        Show toast (5000ms)
      </Button>
    </>
  ),
};

export const CloseToast: Story = {
  render: function Render() {
    const [toastKey, setToastKey] = useState<string | null>(null);

    return (
      <>
        <Button
          onPress={() => {
            if (!toastKey) {
              setToastKey(
                toast.add({
                  title: 'Unable to save',
                  onClose: () => setToastKey(null),
                })
              );
            } else {
              toast.close(toastKey);
            }
          }}
          variant="fade-contrast-filled"
        >
          {toastKey ? 'Hide' : 'Show'} Toast
        </Button>
      </>
    );
  },
};

export const Actions: Story = {
  render: () => (
    <>
      <Button
        onPress={() =>
          toast.add({
            title: 'Message',
            description:
              'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Esse rerum sed sunt.',
            action: (
              <>
                <Link
                  as="button"
                  onPress={() => alert('Submit the first action')}
                  isPseudo
                >
                  First action
                </Link>
                <Link
                  as="button"
                  onPress={() => alert('Submit the second action')}
                  isPseudo
                >
                  Second action
                </Link>
              </>
            ),
          })
        }
        variant="fade-contrast-filled"
      >
        Show toast with actions
      </Button>
    </>
  ),
};
