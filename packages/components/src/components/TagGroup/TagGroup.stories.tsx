import { IconGlobe16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { useListData } from '../index';

import { Tag, tagGroupPropVariant } from './index';
import { TagGroup } from './TagGroup';
import { type TagGroupProps } from './types';

const meta = {
  title: 'Components/TagGroup',
  component: TagGroup,
  subcomponents: { Tag },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TagGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: TagGroupProps<object>) => (
    <TagGroup aria-label="Libraries" {...args}>
      <Tag key="react">React</Tag>
      <Tag key="typescript">Typescript</Tag>
      <Tag key="storybook">Storybook</Tag>
      <Tag key="tailwind">Tailwind</Tag>
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
          aria-label="Libraries"
          {...args}
        >
          <Tag key="react">React</Tag>
          <Tag key="typescript">Typescript</Tag>
          <Tag key="storybook">Storybook</Tag>
          <Tag key="tailwind">Tailwind</Tag>
        </TagGroup>
      ))}
    </FlexBox>
  ),
};

export const RemoveTags: Story = {
  render: function Render() {
    const list = useListData<{ id: number; name: string }>({
      initialItems: [
        { id: 1, name: 'React' },
        { id: 2, name: 'Typescript' },
        { id: 3, name: 'Storybook' },
        { id: 4, name: 'Tailwind' },
      ],
    });

    return (
      <TagGroup
        aria-label="Libraries"
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
    <TagGroup aria-label="Methods" disabledKeys={['delete']} {...args}>
      <Tag key="get">GET</Tag>
      <Tag key="post">POST</Tag>
      <Tag key="put">PUT</Tag>
      <Tag key="patch">PATCH</Tag>
      <Tag key="delete">DELETE</Tag>
    </TagGroup>
  ),
};

export const Icon: Story = {
  render: (args: TagGroupProps<object>) => (
    <TagGroup aria-label="Methods" {...args}>
      <Tag key="get" icon={<IconGlobe16 />}>
        GET
      </Tag>
      <Tag key="post" icon={<IconGlobe16 />}>
        POST
      </Tag>
      <Tag key="put" icon={<IconGlobe16 />}>
        PUT
      </Tag>
      <Tag key="patch" icon={<IconGlobe16 />}>
        PATCH
      </Tag>
      <Tag key="delete" icon={<IconGlobe16 />}>
        DELETE
      </Tag>
    </TagGroup>
  ),
};

export const Links: Story = {
  render: (args: TagGroupProps<object>) => (
    <TagGroup aria-label="Libraries" {...args}>
      <Tag href="https://react.dev/" target="_blank">
        React
      </Tag>
      <Tag href="https://www.typescriptlang.org/" target="_blank">
        Typescript
      </Tag>
      <Tag href="https://storybook.js.org/" target="_blank">
        Storybook
      </Tag>
    </TagGroup>
  ),
};
