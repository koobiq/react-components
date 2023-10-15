import * as Icons from '@koobiq/react-icons';
import { IconCloudO16, IconStar16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { flex } from '../layout';

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
  render: (args: BadgeBaseProps) => (
    // eslint-disable-next-line no-alert
    <Badge label="Badge" {...args} />
  ),
};

export const Size: Story = {
  render: (args: BadgeBaseProps) => (
    <div
      className={flex({ gap: 'l', direction: 'column', alignItems: 'center' })}
    >
      {badgePropSize.map((size) => (
        <Badge label={`size = ${size}`} key={size} size={size} {...args} />
      ))}
    </div>
  ),
};

export const Variant: Story = {
  render: (args: BadgeBaseProps) => (
    <div className={flex({ gap: 'l', alignItems: 'center', wrap: 'wrap' })}>
      {badgePropVariant.map((variant) => (
        <Badge
          label={`variant = ${variant}`}
          key={variant}
          variant={variant}
          {...args}
        />
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  render: (args: BadgeBaseProps) => (
    <Badge label="Badge" startIcon="0.8" endIcon={<IconCloudO16 />} {...args} />
  ),
};

export const LongLabel: Story = {
  render: (args: BadgeBaseProps) => (
    <div style={{ display: 'flex', width: 180, overflow: 'hidden' }}>
      <Badge
        label="Very-very-very long text"
        startIcon={<IconStar16 />}
        {...args}
      />
    </div>
  ),
};
