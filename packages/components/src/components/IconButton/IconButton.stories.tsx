import * as Icons from '@koobiq/react-icons';
import {
  IconBolt16,
  IconMagnifyingGlass16,
  IconMagnifyingGlass24,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { flex } from '../layout';
import { Typography } from '../Typography';

import {
  type IconButtonBaseProps,
  iconButtonPropSize,
  iconButtonPropVariant,
} from './index.js';
import { IconButton } from './index.js';

const mappingIcons = Object.entries(Icons).reduce((acc, [key, Icon]) => ({
  ...acc,
  [key]: <Icon />,
}));

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    children: {
      options: Object.keys(Icons),
      mapping: mappingIcons,
      control: {
        type: 'select',
      },
    },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: IconButtonBaseProps) => (
    // eslint-disable-next-line no-alert
    <IconButton onPress={() => alert('Click')} {...args}>
      {args.children || <IconMagnifyingGlass24 />}
    </IconButton>
  ),
};

export const Size: Story = {
  render: (args: IconButtonBaseProps) => (
    <div className={flex({ gap: 'l' })}>
      {iconButtonPropSize.map((size) => (
        <IconButton key={size} size={size} {...args}>
          {size === 'l' ? <IconMagnifyingGlass16 /> : <IconMagnifyingGlass24 />}
        </IconButton>
      ))}
    </div>
  ),
};

export const Variant: Story = {
  render: (args: IconButtonBaseProps) => (
    <div
      style={{
        rowGap: '1em',
        columnGap: '2em',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
      }}
    >
      {iconButtonPropVariant.map((variant) => (
        <div key={variant} className={flex({ gap: 's', direction: 'column' })}>
          <Typography variant="text-compact">{variant}</Typography>
          <IconButton variant={variant} {...args}>
            <IconMagnifyingGlass24 />
          </IconButton>
        </div>
      ))}
    </div>
  ),
};

export const Disabled: Story = {
  render: (args: IconButtonBaseProps) => (
    <IconButton isDisabled {...args}>
      <IconMagnifyingGlass24 />
    </IconButton>
  ),
};

export const Compact: Story = {
  render: (args: IconButtonBaseProps) => (
    <IconButton size="l" isCompact {...args}>
      <IconMagnifyingGlass16 />
    </IconButton>
  ),
};

export const RootTag: Story = {
  render: () => (
    <IconButton as="a" href="#" variant="theme-contrast">
      <IconBolt16 />
    </IconButton>
  ),
};
