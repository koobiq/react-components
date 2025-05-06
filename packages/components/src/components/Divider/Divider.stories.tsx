import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { Typography } from '../Typography';

import { Divider, type DividerBaseProps } from './index';

const meta = {
  title: 'Components/Divider',
  component: Divider,
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: DividerBaseProps) => (
    <FlexBox direction="column">
      <Typography>Content above</Typography>
      <Divider {...args} />
      <Typography>Content below</Typography>
    </FlexBox>
  ),
};

export const Orientation: Story = {
  render: (args: DividerBaseProps) => (
    <FlexBox>
      <Typography>Content left</Typography>
      <Divider orientation="vertical" as="span" flexItem {...args} />
      <Typography>Content right</Typography>
    </FlexBox>
  ),
};
