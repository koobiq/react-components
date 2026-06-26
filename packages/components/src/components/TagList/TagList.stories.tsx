import { useState } from 'react';

import { IconGlobe16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { FlexBox } from '../FlexBox';
import { Typography, useListData } from '../index';

import { TagList } from './TagList';
import { tagListPropVariant } from './types';

const meta = {
  title: 'Components/TagList',
  component: TagList,
  subcomponents: { 'TagList.Tag': TagList.Tag },
  parameters: {
    layout: 'centered',
  },
  tags: ['status:new', 'date:2026-06-26'],
} satisfies Meta<typeof TagList>;

export default meta;
type Story = StoryObj<typeof TagList>;

export const Base: Story = {
  render: (args) => (
    <TagList
      aria-label="Libraries"
      selectionMode="multiple"
      disabledKeys={['tailwind']}
      {...args}
    >
      <TagList.Tag key="react">React</TagList.Tag>
      <TagList.Tag key="typescript">Typescript</TagList.Tag>
      <TagList.Tag key="storybook">Storybook</TagList.Tag>
      <TagList.Tag key="tailwind">Tailwind</TagList.Tag>
    </TagList>
  ),
};

export const Variant: Story = {
  render: (args) => (
    <FlexBox direction="column" gap="m">
      {tagListPropVariant.map((variant) => (
        <TagList
          key={variant}
          variant={variant}
          aria-label="Libraries"
          onRemove={() => undefined}
          {...args}
        >
          <TagList.Tag key="react">React</TagList.Tag>
          <TagList.Tag key="typescript">Typescript</TagList.Tag>
          <TagList.Tag key="storybook">Storybook</TagList.Tag>
          <TagList.Tag key="tailwind">Tailwind</TagList.Tag>
        </TagList>
      ))}
    </FlexBox>
  ),
};

export const ModifierSelection: Story = {
  render: (args) => (
    <TagList aria-label="Libraries" selectionMode="multiple" {...args}>
      <TagList.Tag key="react">React</TagList.Tag>
      <TagList.Tag key="typescript">Typescript</TagList.Tag>
      <TagList.Tag key="storybook">Storybook</TagList.Tag>
      <TagList.Tag key="tailwind">Tailwind</TagList.Tag>
    </TagList>
  ),
};

export const RemoveTags: Story = {
  render: function Render(args) {
    const list = useListData<{ id: number; name: string }>({
      initialItems: [
        { id: 1, name: 'React' },
        { id: 2, name: 'Typescript' },
        { id: 3, name: 'Storybook' },
        { id: 4, name: 'Tailwind' },
      ],
    });

    return (
      <TagList<{ id: number; name: string }>
        items={list.items}
        disabledKeys={[4]}
        aria-label="Libraries"
        selectionMode="multiple"
        onRemove={(keys) => {
          args.onRemove?.(keys);
          list.remove(...keys);
        }}
      >
        {(item) => <TagList.Tag>{item.name}</TagList.Tag>}
      </TagList>
    );
  },
};

export const DisabledTags: Story = {
  render: (args) => (
    <TagList aria-label="Methods" disabledKeys={['delete']} {...args}>
      <TagList.Tag key="get">GET</TagList.Tag>
      <TagList.Tag key="post">POST</TagList.Tag>
      <TagList.Tag key="put">PUT</TagList.Tag>
      <TagList.Tag key="patch">PATCH</TagList.Tag>
      <TagList.Tag key="delete">DELETE</TagList.Tag>
    </TagList>
  ),
};

export const Icon: Story = {
  render: (args) => (
    <TagList aria-label="Methods" {...args}>
      <TagList.Tag key="get" icon={<IconGlobe16 />}>
        GET
      </TagList.Tag>
      <TagList.Tag key="post" icon={<IconGlobe16 />}>
        POST
      </TagList.Tag>
      <TagList.Tag key="put" icon={<IconGlobe16 />}>
        PUT
      </TagList.Tag>
      <TagList.Tag key="patch" icon={<IconGlobe16 />}>
        PATCH
      </TagList.Tag>
      <TagList.Tag key="delete" icon={<IconGlobe16 />}>
        DELETE
      </TagList.Tag>
    </TagList>
  ),
};

export const ControlledSelection: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<Set<string | number>>(
      new Set(['react'])
    );

    return (
      <FlexBox direction="column" gap="s">
        <TagList
          aria-label="Libraries"
          selectionMode="multiple"
          selectedKeys={selected}
          onSelectionChange={(keys) =>
            setSelected(
              keys === 'all'
                ? new Set(['react', 'typescript', 'storybook', 'tailwind'])
                : new Set(keys)
            )
          }
        >
          <TagList.Tag key="react">React</TagList.Tag>
          <TagList.Tag key="typescript">Typescript</TagList.Tag>
          <TagList.Tag key="storybook">Storybook</TagList.Tag>
          <TagList.Tag key="tailwind">Tailwind</TagList.Tag>
        </TagList>
        <Typography>
          Selected: {[...selected].join(', ') || '(none)'}
        </Typography>
      </FlexBox>
    );
  },
};

export const LongTextEllipsis: Story = {
  render: () => (
    <FlexBox direction="column" gap="s" style={{ inlineSize: 240 }}>
      <TagList aria-label="Long values" onRemove={() => undefined}>
        <TagList.Tag key="1">
          A very long tag value that should be truncated with an ellipsis
        </TagList.Tag>
        <TagList.Tag key="2">
          Another extremely lengthy entry inside a narrow container
        </TagList.Tag>
        <TagList.Tag key="3">Short</TagList.Tag>
      </TagList>
    </FlexBox>
  ),
};

export const EmptyState: Story = {
  render: () => (
    <TagList<{ id: string }>
      aria-label="Empty list"
      items={[] as Iterable<{ id: string }>}
    >
      {(item) => <TagList.Tag key={item.id}>{item.id}</TagList.Tag>}
    </TagList>
  ),
};

export const DynamicItems: Story = {
  render: function Render() {
    const list = useListData<{ id: string; name: string }>({
      initialItems: [
        { id: 'react', name: 'React' },
        { id: 'typescript', name: 'Typescript' },
      ],
    });

    const [counter, setCounter] = useState(1);

    return (
      <FlexBox direction="column" gap="s">
        <FlexBox gap="s">
          <button
            type="button"
            onClick={() => {
              const id = `item-${counter}`;
              list.append({ id, name: `Item ${counter}` });
              setCounter((n) => n + 1);
            }}
          >
            Add item
          </button>
          <button
            type="button"
            onClick={() => {
              const last = list.items[list.items.length - 1];
              if (last) list.remove(last.id);
            }}
          >
            Remove last
          </button>
        </FlexBox>
        <TagList<{ id: string; name: string }>
          aria-label="Dynamic"
          items={list.items}
          onRemove={(keys) => list.remove(...keys)}
        >
          {(item) => <TagList.Tag key={item.id}>{item.name}</TagList.Tag>}
        </TagList>
      </FlexBox>
    );
  },
};
