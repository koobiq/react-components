import {
  IconTextBold16,
  IconTextItalic16,
  IconTextUnderline16,
} from '@koobiq/react-icons';
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
    <div
      style={{
        height: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <Typography>Content left</Typography>
      <Divider orientation="vertical" {...args} />
      <Typography>Content right</Typography>
    </div>
  ),
};

export const FlexItem: Story = {
  render: (args: DividerBaseProps) => (
    <FlexBox gap="m">
      <IconTextBold16 />
      <Divider orientation="vertical" flexItem disablePaddings {...args} />
      <IconTextItalic16 />
      <Divider orientation="vertical" flexItem disablePaddings {...args} />
      <IconTextUnderline16 />
    </FlexBox>
  ),
};

export const RootTag: Story = {
  render: () => (
    <ul style={{ listStyle: 'none', width: 240, padding: 0, margin: 0 }}>
      <Typography as="li">First item</Typography>
      <Divider as="hr" />
      <Typography as="li">Second item</Typography>
      <Divider as="hr" />
      <Typography as="li">Third item</Typography>
    </ul>
  ),
};

export const DividerText: Story = {
  render: (args: DividerBaseProps) => (
    <FlexBox alignItems="center" gap="m" style={{ width: 240 }}>
      <Divider
        as="span"
        style={{
          flexShrink: 1,
        }}
        {...args}
      />
      <Typography>Text</Typography>
      <Divider
        as="span"
        style={{
          flexShrink: 1,
        }}
        {...args}
      />
    </FlexBox>
  ),
};
