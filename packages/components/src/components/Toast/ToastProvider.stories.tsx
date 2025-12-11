import { useState } from 'react';

import { IconVpn16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Grid } from '../Grid';
import { Link } from '../Link';
import { Modal } from '../Modal';

import type {
  ToastProviderProps,
  ToastPlacement,
  ToastStackDirection,
} from './index';
import { ToastProvider, toast } from './index';

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
  parameters: {
    preventToastProvider: true,
  },
  render: (args) => (
    <>
      <ToastProvider {...args} />
      <Button
        onPress={() =>
          toast.add({
            title: 'How to create a Toast Notification',
            caption: "Let's build it with Koobiq React",
          })
        }
        variant="fade-contrast-filled"
      >
        Show Toast
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
              title: 'This is an info Toast.',
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
              title: 'This is a success Toast.',
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
              title: 'This is a warning Toast.',
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
              title: 'This is an error Toast.',
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
    <FlexBox gap="m" direction={{ m: 'column', l: 'row' }} alignItems="center">
      <Button
        onPress={() =>
          toast.add({
            title: 'This Toast will be dismissed in 5 seconds.',
            status: 'success',
          })
        }
        variant="fade-contrast-filled"
      >
        Show Toast (5000ms)
      </Button>
      <Button
        onPress={() =>
          toast.add({
            title: 'This Toast will be dismissed in 8 seconds.',
            status: 'success',
            timeout: 8000,
          })
        }
        variant="fade-contrast-filled"
      >
        Show Toast (8000ms)
      </Button>
      <Button
        onPress={() =>
          toast.add({
            title: 'This Toast will not be dismissed.',
            status: 'success',
            timeout: Infinity,
          })
        }
        variant="fade-contrast-filled"
      >
        Show Toast
      </Button>
    </FlexBox>
  ),
};

export const CloseToast: Story = {
  render: function Render() {
    const [toastKey, setToastKey] = useState<string | null>(null);

    return (
      <Button
        onPress={() => {
          if (!toastKey) {
            setToastKey(
              toast.add({
                title: 'Unable to save',
                onClose: () => setToastKey(null),
                timeout: Infinity,
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
    );
  },
};

export const Actions: Story = {
  render: () => (
    <>
      <Button
        onPress={() =>
          toast.add({
            title: 'By the way',
            caption: 'This Toast uses a Link component for its action.',
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
        Show Toast with actions
      </Button>
    </>
  ),
};

export const CustomToast: Story = {
  render: () => (
    <Button
      onPress={() =>
        toast.add({
          title: 'VPN Connected',
          timeout: Infinity,
          props: {
            icon: <IconVpn16 />,
            className: 'myToast',
          },
        })
      }
      variant="fade-contrast-filled"
    >
      Custom Toast
    </Button>
  ),
};

export const Overlays: Story = {
  render: () => (
    <FlexBox gap="l">
      <Modal
        size="small"
        control={(props) => <Button {...props}>Show Modal</Button>}
      >
        {({ close }) => (
          <>
            <Modal.Header>Modal</Modal.Header>
            <Modal.Body>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Aspernatur cupiditate, eos et explicabo harum nobis obcaecati
              quidem. Accusamus, fuga, officia.
            </Modal.Body>
            <Modal.Footer>
              <Button onPress={close}>Close</Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
      <Button
        onPress={() => {
          toast.add({
            title: 'VPN Connected',
            timeout: Infinity,
            props: {
              icon: <IconVpn16 />,
              className: 'myToast',
            },
          });
        }}
        variant="fade-contrast-filled"
      >
        Show Toast
      </Button>
    </FlexBox>
  ),
};

export const Placement: Story = {
  parameters: {
    preventToastProvider: true,
  },
  render: function Render(args) {
    const [placement, setPlacement] = useState<ToastPlacement>();

    const handleOnPress = (placement: ToastPlacement) => () => {
      setPlacement(placement);

      toast.add({
        title: `My placement: ${placement}`,
      });
    };

    return (
      <>
        <ToastProvider placement={placement} {...args} />
        <Grid cols={3} gap="m">
          <Grid.Item colStart={2}>
            <Button
              onPress={handleOnPress('top')}
              variant="fade-contrast-filled"
              fullWidth
            >
              top
            </Button>
          </Grid.Item>
          <Grid.Item colStart={1} rowStart={2}>
            <Button
              onPress={handleOnPress('top-start')}
              variant="fade-contrast-filled"
              fullWidth
            >
              top-start
            </Button>
          </Grid.Item>
          <Grid.Item colStart={3} rowStart={2}>
            <Button
              onPress={handleOnPress('top-end')}
              variant="fade-contrast-filled"
              fullWidth
            >
              top-end
            </Button>
          </Grid.Item>
          <Grid.Item colStart={1} rowStart={3}>
            <Button
              onPress={handleOnPress('bottom-start')}
              variant="fade-contrast-filled"
              fullWidth
            >
              bottom-start
            </Button>
          </Grid.Item>
          <Grid.Item colStart={3} rowStart={3}>
            <Button
              onPress={handleOnPress('bottom-end')}
              variant="fade-contrast-filled"
              fullWidth
            >
              bottom-end
            </Button>
          </Grid.Item>
          <Grid.Item colStart={2} rowStart={4}>
            <Button
              onPress={handleOnPress('bottom')}
              variant="fade-contrast-filled"
              fullWidth
            >
              bottom
            </Button>
          </Grid.Item>
        </Grid>
      </>
    );
  },
};

export const StackDirection: Story = {
  parameters: {
    preventToastProvider: true,
  },
  render: function Render(args) {
    const [stackDirection, setStackDirection] = useState<ToastStackDirection>();

    const handleOnPress = (direction: ToastStackDirection) => () => {
      setStackDirection(direction);

      toast.add({
        title: `My stack direction: ${direction}`,
        timeout: Infinity,
      });
    };

    return (
      <>
        <ToastProvider
          stackDirection={stackDirection}
          placement="top"
          {...args}
        />
        <FlexBox gap="m">
          <Button
            onPress={handleOnPress('descending')}
            variant="fade-contrast-filled"
          >
            descending
          </Button>
          <Button
            onPress={handleOnPress('ascending')}
            variant="fade-contrast-filled"
          >
            ascending
          </Button>
        </FlexBox>
      </>
    );
  },
};
