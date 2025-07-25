import { useBoolean } from '@koobiq/react-core';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { FlexBox } from '../FlexBox';
import { Toggle } from '../Toggle';

import { SkeletonBlock, type SkeletonBlockProps } from './index';

const meta = {
  title: 'Components/SkeletonBlock',
  component: SkeletonBlock,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof SkeletonBlock>;

export default meta;
type Story = StoryObj<SkeletonBlockProps>;

export const Base: Story = {
  render: (args) => (
    <SkeletonBlock inlineSize={100} blockSize={100} {...args} />
  ),
};

export const Example1: Story = {
  name: 'Example 1',
  render: function Render(args) {
    const [isShown, { toggle }] = useBoolean(false);

    return (
      <FlexBox gap="m" direction="column">
        <Toggle onChange={toggle}>Skeletonization</Toggle>
        {isShown ? (
          <SkeletonBlock {...args}>
            <Button>Send message</Button>
          </SkeletonBlock>
        ) : (
          <Button>Send message</Button>
        )}
      </FlexBox>
    );
  },
};

export const Example2: Story = {
  name: 'Example 2',
  render: function Render() {
    const [isShown, { toggle }] = useBoolean(false);

    return (
      <FlexBox gap="m" direction="column">
        <Toggle onChange={toggle}>Skeletonization</Toggle>
        {isShown ? (
          <FlexBox gap="s" alignItems="center" style={{ blockSize: 20 }}>
            <SkeletonBlock inlineSize={16} blockSize={16} />
            <SkeletonBlock inlineSize={100} blockSize={16} />
          </FlexBox>
        ) : (
          <Checkbox>Check me</Checkbox>
        )}
      </FlexBox>
    );
  },
};
