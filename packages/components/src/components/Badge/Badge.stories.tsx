import * as Icons from '@koobiq/react-icons';
import { IconCloudO16, IconStar16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';

import type { BadgeBaseProps } from './index.js';
import { Badge, badgePropSize, badgePropVariant } from './index.js';

const mappingIcons = Object.entries(Icons).reduce((acc, [key, Icon]) => ({
  ...acc,
  [key]: <Icon />,
}));

const meta = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    startIcon: {
      options: Object.keys(Icons),
      mapping: mappingIcons,
      control: {
        type: 'select',
      },
    },
    endIcon: {
      options: Object.keys(Icons),
      mapping: mappingIcons,
      control: {
        type: 'select',
      },
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: BadgeBaseProps) => <Badge {...args}>Badge</Badge>,
};

export const Size: Story = {
  render: (args: BadgeBaseProps) => (
    <FlexBox gap="l" direction="column" alignItems="center">
      {badgePropSize.map((size) => (
        <Badge key={size} size={size} {...args}>
          size = {size}
        </Badge>
      ))}
    </FlexBox>
  ),
};

export const Variant: Story = {
  render: (args: BadgeBaseProps) => (
    <FlexBox gap="l" alignItems="center" wrap="wrap">
      {badgePropVariant.map((variant) => (
        <Badge key={variant} variant={variant} {...args}>
          variant = {variant}
        </Badge>
      ))}
    </FlexBox>
  ),
};

export const WithIcons: Story = {
  render: (args: BadgeBaseProps) => (
    <Badge startIcon="0.8" endIcon={<IconCloudO16 />} {...args}>
      Badge
    </Badge>
  ),
};

export const LongLabel: Story = {
  render: (args: BadgeBaseProps) => (
    <div style={{ display: 'flex', width: 180, overflow: 'hidden' }}>
      <Badge startIcon={<IconStar16 />} {...args}>
        A very-very-very long text
      </Badge>
    </div>
  ),
};
