import { IconCheckCircle16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { useListData } from '../index';

import { Tag, tagGroupPropVariant } from './index';
import { TagGroup } from './TagGroup';
import { type TagGroupProps } from './types';

const meta = {
  title: 'Components/TagGroup',
  component: TagGroup,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TagGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: TagGroupProps<object>) => (
    <TagGroup aria-label="Categories" {...args}>
      <Tag key="news">News</Tag>
      <Tag key="travel">Travel</Tag>
      <Tag key="gaming">Gaming</Tag>
      <Tag key="shopping">Shopping</Tag>
    </TagGroup>
  ),
};

export const Variant: Story = {
  render: (args: TagGroupProps<object>) => (
    <FlexBox direction="column" gap="m">
      {tagGroupPropVariant.map((variant) => (
        <TagGroup
          key={variant}
          variant={variant}
          onRemove={() => undefined}
          aria-label="Categories"
          {...args}
        >
          <Tag key="news">News</Tag>
          <Tag key="travel">Travel</Tag>
          <Tag key="gaming">Gaming</Tag>
          <Tag key="shopping">Shopping</Tag>
        </TagGroup>
      ))}
    </FlexBox>
  ),
};

export const RemoveTags: Story = {
  render: function Render() {
    const list = useListData({
      initialItems: [
        { id: 1, name: 'News' },
        { id: 2, name: 'Travel' },
        { id: 3, name: 'Gaming' },
        { id: 4, name: 'Shopping' },
      ],
    });

    return (
      <TagGroup
        label="Categories"
        items={list.items}
        onRemove={(keys) => list.remove(...keys)}
      >
        {(item) => <Tag>{item.name}</Tag>}
      </TagGroup>
    );
  },
};

export const DisabledTags: Story = {
  render: (args: TagGroupProps<object>) => (
    <TagGroup disabledKeys={['tuna']} {...args}>
      <Tag key="lettuce">Lettuce</Tag>
      <Tag key="tomato">Tomato</Tag>
      <Tag key="cheese">Cheese</Tag>
      <Tag key="tuna">Tuna Salad</Tag>
      <Tag key="egg">Egg Salad</Tag>
      <Tag key="ham">Ham</Tag>
    </TagGroup>
  ),
};

export const Icon: Story = {
  render: (args: TagGroupProps<object>) => (
    <TagGroup {...args}>
      <Tag key="lettuce" icon={<IconCheckCircle16 />}>
        Lettuce
      </Tag>
      <Tag key="tomato" icon={<IconCheckCircle16 />}>
        Tomato
      </Tag>
      <Tag key="cheese" icon={<IconCheckCircle16 />}>
        Cheese
      </Tag>
      <Tag key="tuna" icon={<IconCheckCircle16 />}>
        Tuna Salad
      </Tag>
      <Tag key="egg" icon={<IconCheckCircle16 />}>
        Egg Salad
      </Tag>
      <Tag key="ham" icon={<IconCheckCircle16 />}>
        Ham
      </Tag>
    </TagGroup>
  ),
};
