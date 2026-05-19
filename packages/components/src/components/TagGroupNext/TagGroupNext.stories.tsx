import { useRef, useState, type KeyboardEvent } from 'react';

import { IconGlobe16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { FlexBox } from '../FlexBox';
import { useListData } from '../index';
import { Input } from '../Input';

import { TagGroupNext } from './TagGroupNext';
import { tagGroupNextPropVariant } from './types';

const meta = {
  title: 'Components/TagGroupNext',
  component: TagGroupNext,
  subcomponents: { Tag: TagGroupNext.Tag },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TagGroupNext>;

export default meta;
type Story = StoryObj<typeof TagGroupNext>;

type EditableTagItem = {
  id: string;
  name: string;
};

const editableInitialItems: EditableTagItem[] = [
  { id: 'react', name: 'React' },
  { id: 'typescript', name: 'Typescript' },
  { id: 'storybook', name: 'Storybook' },
];

export const Base: Story = {
  render: (args) => (
    <TagGroupNext
      aria-label="Libraries"
      selectionMode="multiple"
      disabledKeys={['tailwind']}
      {...args}
    >
      <TagGroupNext.Tag key="react">React</TagGroupNext.Tag>
      <TagGroupNext.Tag key="typescript">Typescript</TagGroupNext.Tag>
      <TagGroupNext.Tag key="storybook">Storybook</TagGroupNext.Tag>
      <TagGroupNext.Tag key="tailwind">Tailwind</TagGroupNext.Tag>
    </TagGroupNext>
  ),
};

export const Variant: Story = {
  render: (args) => (
    <FlexBox direction="column" gap="m">
      {tagGroupNextPropVariant.map((variant) => (
        <TagGroupNext
          key={variant}
          variant={variant}
          onRemove={() => undefined}
          aria-label="Libraries"
          {...args}
        >
          <TagGroupNext.Tag key="react">React</TagGroupNext.Tag>
          <TagGroupNext.Tag key="typescript">Typescript</TagGroupNext.Tag>
          <TagGroupNext.Tag key="storybook">Storybook</TagGroupNext.Tag>
          <TagGroupNext.Tag key="tailwind">Tailwind</TagGroupNext.Tag>
        </TagGroupNext>
      ))}
    </FlexBox>
  ),
};

export const ModifierSelection: Story = {
  render: (args) => (
    <TagGroupNext aria-label="Libraries" selectionMode="multiple" {...args}>
      <TagGroupNext.Tag key="react">React</TagGroupNext.Tag>
      <TagGroupNext.Tag key="typescript">Typescript</TagGroupNext.Tag>
      <TagGroupNext.Tag key="storybook">Storybook</TagGroupNext.Tag>
      <TagGroupNext.Tag key="tailwind">Tailwind</TagGroupNext.Tag>
    </TagGroupNext>
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
      <TagGroupNext<{ id: number; name: string }>
        aria-label="Libraries"
        selectionMode="multiple"
        items={list.items}
        disabledKeys={[4]}
        onRemove={(keys) => {
          args.onRemove?.(keys);
          list.remove(...keys);
        }}
      >
        {(item) => <TagGroupNext.Tag>{item.name}</TagGroupNext.Tag>}
      </TagGroupNext>
    );
  },
};

export const WithInput: Story = {
  render: function Render() {
    const tagGroupRef = useRef<HTMLDivElement>(null);
    const nextIdRef = useRef(1);

    const list = useListData<EditableTagItem>({
      initialItems: editableInitialItems,
    });
    const [value, setValue] = useState('');

    const focusLastTag = () => {
      const tags =
        tagGroupRef.current?.querySelectorAll<HTMLElement>('[role="row"]');

      tags?.[tags.length - 1]?.focus();
    };

    const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        const name = value.trim();

        if (!name) return;

        event.preventDefault();
        const id = `custom-${nextIdRef.current}`;
        nextIdRef.current += 1;

        list.append({ id, name });
        setValue('');

        return;
      }

      if (
        event.key === 'ArrowLeft' &&
        event.currentTarget.selectionStart === 0 &&
        event.currentTarget.selectionEnd === 0
      ) {
        event.preventDefault();
        focusLastTag();
      }
    };

    return (
      <FlexBox direction="column" gap="s" style={{ inlineSize: 180 }}>
        <Input
          value={value}
          onChange={setValue}
          aria-label="Add library"
          placeholder="Add library"
          slotProps={{
            input: {
              onKeyDown: handleInputKeyDown,
            },
          }}
          fullWidth
        />
        <TagGroupNext<EditableTagItem>
          ref={tagGroupRef}
          items={list.items}
          selectionMode="multiple"
          aria-label="Selected libraries"
          onRemove={(keys) => list.remove(...keys)}
        >
          {(item) => (
            <TagGroupNext.Tag key={item.id} textValue={item.name}>
              {item.name}
            </TagGroupNext.Tag>
          )}
        </TagGroupNext>
      </FlexBox>
    );
  },
};

export const DisabledTags: Story = {
  render: (args) => (
    <TagGroupNext aria-label="Methods" disabledKeys={['delete']} {...args}>
      <TagGroupNext.Tag key="get">GET</TagGroupNext.Tag>
      <TagGroupNext.Tag key="post">POST</TagGroupNext.Tag>
      <TagGroupNext.Tag key="put">PUT</TagGroupNext.Tag>
      <TagGroupNext.Tag key="patch">PATCH</TagGroupNext.Tag>
      <TagGroupNext.Tag key="delete">DELETE</TagGroupNext.Tag>
    </TagGroupNext>
  ),
};

export const Icon: Story = {
  render: (args) => (
    <TagGroupNext aria-label="Methods" {...args}>
      <TagGroupNext.Tag key="get" icon={<IconGlobe16 />}>
        GET
      </TagGroupNext.Tag>
      <TagGroupNext.Tag key="post" icon={<IconGlobe16 />}>
        POST
      </TagGroupNext.Tag>
      <TagGroupNext.Tag key="put" icon={<IconGlobe16 />}>
        PUT
      </TagGroupNext.Tag>
      <TagGroupNext.Tag key="patch" icon={<IconGlobe16 />}>
        PATCH
      </TagGroupNext.Tag>
      <TagGroupNext.Tag key="delete" icon={<IconGlobe16 />}>
        DELETE
      </TagGroupNext.Tag>
    </TagGroupNext>
  ),
};
