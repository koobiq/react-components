import { useRef, useState } from 'react';

import type { Key, Selection } from '@koobiq/react-core';
import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { Form } from '../Form';
import { useListData } from '../index';
import { Typography } from '../Typography';

import { TagInput } from './TagInput';
import type { TagInputProps } from './types';
import { tagInputPropVariant } from './types';

type TagItem = { id: string; name: string };

const meta = {
  title: 'Components/TagInput',
  component: TagInput,
  parameters: { layout: 'centered' },
  tags: ['status:new', 'date:2026-05-25'],
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<TagInputProps<TagItem>>;

export const Base: Story = {
  render: function Render() {
    const tagCounter = useRef(0);

    const list = useListData<TagItem>({
      initialItems: [
        { id: 'react', name: 'React' },
        { id: 'typescript', name: 'TypeScript' },
      ],
    });

    const createTag = (name: string): TagItem => {
      tagCounter.current += 1;

      return { id: `tag-${tagCounter.current}-${name}`, name };
    };

    return (
      <TagInput<TagItem>
        label="Tags"
        style={{ inlineSize: '100%', maxInlineSize: 360 }}
        placeholder="Type and press Enter"
        items={list.items}
        onAdd={(values) => list.append(...values.map(createTag))}
        onRemove={(keys) => list.remove(...keys)}
      >
        {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
      </TagInput>
    );
  },
};

export const Variant: Story = {
  render: function Render() {
    return (
      <FlexBox
        gap="m"
        direction="column"
        style={{ inlineSize: '100%', maxInlineSize: 360 }}
      >
        {tagInputPropVariant.map((variant) => (
          <TagInput
            key={variant}
            variant={variant}
            aria-label={`variant-${variant}`}
            placeholder={`variant = ${variant}`}
            fullWidth
          >
            <TagInput.Tag key="one">One</TagInput.Tag>
            <TagInput.Tag key="two">Two</TagInput.Tag>
          </TagInput>
        ))}
      </FlexBox>
    );
  },
};

export const FormField: Story = {
  render: function Render() {
    const categories = useListData<TagItem>({
      initialItems: [
        { id: 'news', name: 'News' },
        { id: 'sports', name: 'Sports' },
      ],
    });

    const tags = useListData<TagItem>({ initialItems: [] });
    const categoryCounter = useRef(0);
    const tagCounter = useRef(0);

    const createCategory = (name: string): TagItem => {
      categoryCounter.current += 1;

      return { id: `category-${categoryCounter.current}-${name}`, name };
    };

    const createTag = (name: string): TagItem => {
      tagCounter.current += 1;

      return { id: `tag-${tagCounter.current}-${name}`, name };
    };

    const isEmpty = tags.items.length === 0;

    return (
      <FlexBox
        direction="column"
        gap="m"
        style={{ inlineSize: '100%', maxInlineSize: 360 }}
      >
        <TagInput<TagItem>
          label="Categories"
          caption="Press Enter or comma to add"
          placeholder="Add a category"
          items={categories.items}
          onAdd={(values) => categories.append(...values.map(createCategory))}
          onRemove={(keys) => categories.remove(...keys)}
          isRequired
          fullWidth
        >
          {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
        </TagInput>
        <TagInput<TagItem>
          label="Tags"
          placeholder="Add at least one tag"
          items={tags.items}
          onAdd={(values) => tags.append(...values.map(createTag))}
          onRemove={(keys) => tags.remove(...keys)}
          isInvalid={isEmpty}
          errorMessage={isEmpty ? 'At least one tag is required' : undefined}
          caption={isEmpty ? undefined : 'Looks good'}
          fullWidth
        >
          {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
        </TagInput>
      </FlexBox>
    );
  },
};

export const Disabled: Story = {
  render: function Render() {
    const list = useListData<TagItem>({
      initialItems: [
        { id: 'react', name: 'React' },
        { id: 'typescript', name: 'TypeScript' },
      ],
    });

    const tagCounter = useRef(0);

    const createTag = (name: string): TagItem => {
      tagCounter.current += 1;

      return { id: `tag-${tagCounter.current}-${name}`, name };
    };

    return (
      <TagInput<TagItem>
        label="Tags"
        style={{ inlineSize: '100%', maxInlineSize: 360 }}
        placeholder="Disabled"
        items={list.items}
        onAdd={(values) => list.append(...values.map(createTag))}
        onRemove={(keys) => list.remove(...keys)}
        isDisabled
      >
        {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
      </TagInput>
    );
  },
};

export const ReadOnly: Story = {
  render: function Render() {
    const list = useListData<TagItem>({
      initialItems: [
        { id: 'react', name: 'React' },
        { id: 'typescript', name: 'TypeScript' },
      ],
    });

    const tagCounter = useRef(0);

    const createTag = (name: string): TagItem => {
      tagCounter.current += 1;

      return { id: `tag-${tagCounter.current}-${name}`, name };
    };

    return (
      <TagInput<TagItem>
        label="Tags"
        style={{ inlineSize: '100%', maxInlineSize: 360 }}
        placeholder="Read-only"
        items={list.items}
        onAdd={(values) => list.append(...values.map(createTag))}
        onRemove={(keys) => list.remove(...keys)}
        isReadOnly
      >
        {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
      </TagInput>
    );
  },
};

export const Clearable: Story = {
  render: function Render() {
    const list = useListData<TagItem>({
      initialItems: [
        { id: 'react', name: 'React' },
        { id: 'typescript', name: 'TypeScript' },
        { id: 'storybook', name: 'Storybook' },
      ],
    });

    const tagCounter = useRef(0);

    const createTag = (name: string): TagItem => {
      tagCounter.current += 1;

      return { id: `tag-${tagCounter.current}-${name}`, name };
    };

    return (
      <TagInput<TagItem>
        label="Tags"
        style={{ inlineSize: '100%', maxInlineSize: 360 }}
        items={list.items}
        placeholder="Type and press Enter"
        onRemove={(keys) => list.remove(...keys)}
        onAdd={(values) => list.append(...values.map(createTag))}
        isClearable
      >
        {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
      </TagInput>
    );
  },
};

export const SplitPattern: Story = {
  render: function Render() {
    const list = useListData<TagItem>({ initialItems: [] });
    const tagCounter = useRef(0);

    const createTag = (name: string): TagItem => {
      tagCounter.current += 1;

      return { id: `tag-${tagCounter.current}-${name}`, name };
    };

    return (
      <TagInput<TagItem>
        label="Tags"
        style={{ inlineSize: '100%', maxInlineSize: 360 }}
        splitPattern={/[,;\s]/}
        caption="Try pasting: foo, bar; baz qux"
        placeholder="Use comma, semicolon or space"
        items={list.items}
        onAdd={(values) => list.append(...values.map(createTag))}
        onRemove={(keys) => list.remove(...keys)}
        fullWidth
      >
        {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
      </TagInput>
    );
  },
};

export const WithSelection: Story = {
  render: function Render() {
    const list = useListData<TagItem>({
      initialItems: [
        { id: 'react', name: 'React' },
        { id: 'typescript', name: 'TypeScript' },
        { id: 'storybook', name: 'Storybook' },
      ],
    });

    const tagCounter = useRef(0);

    const createTag = (name: string): TagItem => {
      tagCounter.current += 1;

      return { id: `tag-${tagCounter.current}-${name}`, name };
    };

    const [selected, setSelected] = useState<Selection>(new Set<Key>());

    return (
      <FlexBox
        direction="column"
        gap="s"
        style={{ inlineSize: '100%', maxInlineSize: 360 }}
      >
        <TagInput<TagItem>
          label="Tags"
          placeholder="Click a tag with Cmd/Ctrl, press Space, or Ctrl+A"
          items={list.items}
          onAdd={(values) => list.append(...values.map(createTag))}
          onRemove={(keys) => list.remove(...keys)}
          selectedKeys={selected}
          onSelectionChange={setSelected}
          fullWidth
        >
          {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
        </TagInput>
        <Typography>
          Selected:{' '}
          {selected === 'all' ? 'all' : [...selected].join(', ') || '(none)'}
        </Typography>
      </FlexBox>
    );
  },
};

export const InsideForm: Story = {
  render: function Render() {
    const list = useListData<TagItem>({
      initialItems: [{ id: 'react', name: 'React' }],
    });

    const tagCounter = useRef(0);

    const createTag = (name: string): TagItem => {
      tagCounter.current += 1;

      return { id: `tag-${tagCounter.current}-${name}`, name };
    };

    return (
      <Form isDisabled style={{ inlineSize: '100%', maxInlineSize: 360 }}>
        <TagInput<TagItem>
          label="Tags"
          placeholder="Form-wide disabled"
          items={list.items}
          onAdd={(values) => list.append(...values.map(createTag))}
          onRemove={(keys) => list.remove(...keys)}
        >
          {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
        </TagInput>
      </Form>
    );
  },
};
