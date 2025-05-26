import { IconCheckCircle16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { flex } from '../layout';

import { Tag } from './Tag';
import { type TagBaseProps, tagPropVariant } from './types';

const meta = {
  title: 'Components/Tag',
  component: Tag,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: TagBaseProps) => (
    <Tag icon={<IconCheckCircle16 />} {...args}>
      Tag
    </Tag>
  ),
};

export const Variant: Story = {
  render: (args: TagBaseProps) => (
    <div className={flex({ gap: 'l', alignItems: 'center', wrap: 'wrap' })}>
      {tagPropVariant.map((variant) => (
        <Tag
          icon={<IconCheckCircle16 />}
          key={variant}
          variant={variant}
          onCancel={() => alert('Cancel')}
          {...args}
        >
          {variant}
        </Tag>
      ))}
    </div>
  ),
};

export const Icon: Story = {
  render: (args: TagBaseProps) => (
    <Tag icon={<IconCheckCircle16 />} {...args}>
      Tag
    </Tag>
  ),
};

export const Disabled: Story = {
  render: (args: TagBaseProps) => (
    <Tag
      icon={<IconCheckCircle16 />}
      onCancel={() => alert('Cancel')}
      isDisabled
      {...args}
    >
      Tag
    </Tag>
  ),
};

export const Cancel: Story = {
  render: (args: TagBaseProps) => (
    <Tag
      icon={<IconCheckCircle16 />}
      variant="warning-fade"
      onCancel={() => alert('Cancel')}
      {...args}
    >
      Tag
    </Tag>
  ),
};

export const LongText: Story = {
  render: (args: TagBaseProps) => (
    <FlexBox style={{ inlineSize: 200 }}>
      <Tag
        icon={<IconCheckCircle16 />}
        variant="warning-fade"
        onCancel={() => alert('Cancel')}
        {...args}
      >
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo, tenetur!
      </Tag>
    </FlexBox>
  ),
};
