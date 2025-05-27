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
    <Tag label="Tag" icon={<IconCheckCircle16 />} {...args} />
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
          label={variant}
          onClose={() => alert('Cancel')}
          {...args}
        />
      ))}
    </div>
  ),
};

export const Icon: Story = {
  render: (args: TagBaseProps) => (
    <Tag label="Tag" icon={<IconCheckCircle16 />} {...args} />
  ),
};

export const Disabled: Story = {
  render: (args: TagBaseProps) => (
    <Tag
      label="Tag"
      icon={<IconCheckCircle16 />}
      onClose={() => alert('Cancel')}
      isDisabled
      {...args}
    />
  ),
};

export const Cancel: Story = {
  render: (args: TagBaseProps) => (
    <Tag
      label="Tag"
      icon={<IconCheckCircle16 />}
      onClose={() => alert('Cancel')}
      {...args}
    />
  ),
};

export const LongText: Story = {
  render: (args: TagBaseProps) => (
    <FlexBox style={{ inlineSize: 200 }}>
      <Tag
        icon={<IconCheckCircle16 />}
        onClose={() => alert('Cancel')}
        label="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illo, tenetur!"
        {...args}
      />
    </FlexBox>
  ),
};
