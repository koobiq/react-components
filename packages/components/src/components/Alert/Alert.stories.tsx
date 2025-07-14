import { useBoolean } from '@koobiq/react-core';
import { IconUserSecret16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Link } from '../Link';

import { type AlertBaseProps } from './index.js';
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
    <FlexBox gap="l" alignItems="center" wrap="wrap">
      <Alert title="Title" status="info" {...args}>
        This is an info Alert.
      </Alert>
      <Alert title="Title" status="success" {...args}>
        This is a success Alert.
      </Alert>
      <Alert title="Title" status="warning" {...args}>
        This is a warning Alert.
      </Alert>
      <Alert title="Title" status="error" {...args}>
        This is an error Alert.
      </Alert>
    </FlexBox>
  ),
};

export const Colored: Story = {
  render: (args: AlertBaseProps) => (
    <FlexBox gap="l" alignItems="center" wrap="wrap">
      <Alert title="Title" status="info" isColored {...args}>
        This is a colored info Alert.
      </Alert>
      <Alert title="Title" status="success" isColored {...args}>
        This is a colored success Alert.
      </Alert>
      <Alert title="Title" status="warning" isColored {...args}>
        This is a colored warning Alert.
      </Alert>
      <Alert title="Title" status="error" isColored {...args}>
        This is a colored error Alert.
      </Alert>
    </FlexBox>
  ),
};

export const Compact: Story = {
  render: (args: AlertBaseProps) => (
    <FlexBox gap="l" alignItems="center" wrap="wrap">
      <Alert title="Title" status="info" isCompact {...args}>
        This is a compact info Alert.
      </Alert>
      <Alert title="Title" status="success" isCompact {...args}>
        This is a compact success Alert.
      </Alert>
      <Alert title="Title" status="warning" isCompact {...args}>
        This is a compact warning Alert.
      </Alert>
      <Alert title="Title" status="error" isCompact {...args}>
        This is a compact error Alert.
      </Alert>
    </FlexBox>
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
        <Link href="/" isPseudo>
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
    const [isOpen, { on, off }] = useBoolean(true);

    return isOpen ? (
      <Alert title="Title" onClose={off} {...args}>
        {text}
      </Alert>
    ) : (
      <Button onPress={on}>Re-open</Button>
    );
  },
};
