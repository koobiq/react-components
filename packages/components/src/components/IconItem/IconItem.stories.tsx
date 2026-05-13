import { IconBell16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { Typography } from '../Typography';

import {
  iconItemPropColor,
  IconItem,
  type IconItemBaseProps,
  iconItemPropSize,
  iconItemPropVariant,
} from './index';

const meta = {
  title: 'Components/IconItem',
  component: IconItem,
  tags: ['status:new', 'date:2026-05-15'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof IconItem>;

export default meta;
type Story = StoryObj<IconItemBaseProps>;

export const Base: Story = {
  render: (args) => (
    <IconItem role="img" aria-label="Notifications" {...args}>
      <IconBell16 />
    </IconItem>
  ),
};

export const Size: Story = {
  render: (args) => (
    <FlexBox gap="l" alignItems="center">
      {iconItemPropSize.map((size) => (
        <FlexBox key={size} gap="s" direction="column" alignItems="center">
          <IconItem
            role="img"
            aria-label={`${size} notifications`}
            {...args}
            size={size}
          >
            <IconBell16 />
          </IconItem>
          <Typography variant="text-compact" color="contrast-secondary">
            {size}
          </Typography>
        </FlexBox>
      ))}
    </FlexBox>
  ),
};

export const Color: Story = {
  render: (args) => (
    <FlexBox gap="l" alignItems="center" wrap="wrap">
      {iconItemPropColor.map((color) => (
        <FlexBox key={color} gap="s" direction="column" alignItems="center">
          <IconItem
            role="img"
            aria-label={`${color} notifications`}
            {...args}
            color={color}
          >
            <IconBell16 />
          </IconItem>
          <Typography variant="text-compact" color="contrast-secondary">
            {color}
          </Typography>
        </FlexBox>
      ))}
    </FlexBox>
  ),
};

export const Variant: Story = {
  render: (args) => (
    <FlexBox gap="l" alignItems="center">
      {iconItemPropVariant.map((variant) => (
        <FlexBox key={variant} gap="s" direction="column" alignItems="center">
          <IconItem
            role="img"
            aria-label={`${variant} notifications`}
            {...args}
            variant={variant}
          >
            <IconBell16 />
          </IconItem>
          <Typography variant="text-compact" color="contrast-secondary">
            {variant}
          </Typography>
        </FlexBox>
      ))}
    </FlexBox>
  ),
};
