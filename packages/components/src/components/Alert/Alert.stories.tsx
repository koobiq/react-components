import { useBoolean } from '@koobiq/react-core';
import { IconUserSecret16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { flex } from '../layout';
import { Link } from '../Link';

import { type AlertBaseProps, alertPropStatus } from './index.js';
import { Alert } from './index.js';

const text =
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus, amet assumenda cum est eum harum odio omnis qui quisquam temporibus';

const meta = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: AlertBaseProps) => (
    <Alert title="Title" {...args}>
      {text}
    </Alert>
  ),
};

export const Status: Story = {
  render: (args: AlertBaseProps) => (
    <div className={flex({ gap: 'l', alignItems: 'center', wrap: 'wrap' })}>
      {alertPropStatus.map((status) => (
        <Alert title="Title" key={status} status={status} {...args}>
          This is a {status} Alert.
        </Alert>
      ))}
    </div>
  ),
};

export const Colored: Story = {
  render: (args: AlertBaseProps) => (
    <div className={flex({ gap: 'l', alignItems: 'center', wrap: 'wrap' })}>
      {alertPropStatus.map((status) => (
        <Alert title="Title" key={status} status={status} colored {...args}>
          This is a {status} Alert.
        </Alert>
      ))}
    </div>
  ),
};

export const Compact: Story = {
  render: (args: AlertBaseProps) => (
    <div className={flex({ gap: 'l', alignItems: 'center', wrap: 'wrap' })}>
      {alertPropStatus.map((status) => (
        <Alert
          title="Title"
          key={status}
          status={status}
          compact
          colored
          {...args}
        >
          This is a {status} Alert.
        </Alert>
      ))}
    </div>
  ),
};

export const Action: Story = {
  render: (args: AlertBaseProps) => (
    <Alert
      title="Title"
      action={
        <>
          <Link
            as="button"
            pseudo
            onPress={() => alert('Submit the first action')}
          >
            First action
          </Link>
          <Link
            as="button"
            pseudo
            onPress={() => alert('Submit the second action')}
          >
            Second action
          </Link>
        </>
      }
      {...args}
    >
      {text}
    </Alert>
  ),
};

export const HiddenIcon: Story = {
  render: (args: AlertBaseProps) => (
    <Alert title="Title" hideIcon {...args}>
      {text}
    </Alert>
  ),
};

export const CustomIcon: Story = {
  render: (args: AlertBaseProps) => (
    <Alert
      icon={<IconUserSecret16 />}
      title="Important information about incognito mode"
      action={
        <Link href="#" pseudo>
          See details
        </Link>
      }
      onClose={() => undefined}
      {...args}
    >
      All modern browsers offer an incognito mode for private browsing. But
      whether you’re going incognito in Chrome, Safari, Firefox, or any other
      browser, the glasses-and-hat disguise won’t cover your tracks as much as
      you think. Keep reading to learn what incognito mode means, how you can
      still be tracked going incognito, and why you’re better off using a
      dedicated secure browser.
    </Alert>
  ),
};

export const CloseButton: Story = {
  render: function Render(args: AlertBaseProps) {
    const [open, { on, off }] = useBoolean(true);

    return open ? (
      <Alert title="Title" onClose={off} {...args}>
        {text}
      </Alert>
    ) : (
      <Button onPress={on}>Re-open</Button>
    );
  },
};
