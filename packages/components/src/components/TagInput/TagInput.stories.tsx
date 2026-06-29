import { useRef, useState } from 'react';

import type { Key, Selection } from '@koobiq/react-core';
import { useTimeout } from '@koobiq/react-core';
import { IconCircleInfo16, IconGridSquares16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { Form } from '../Form';
import { Button, useBreakpoints, useListData } from '../index';
import { Tooltip } from '../Tooltip';
import { Typography } from '../Typography';

import { TagInput } from './TagInput';
import type { TagInputProps } from './types';
import { tagInputPropVariant } from './types';

type TagItem = { id: string; name: string };

const meta = {
  title: 'Components/TagInput',
  component: TagInput,
  subcomponents: { 'TagInput.Tag': TagInput.Tag },
  parameters: { layout: 'centered' },
  tags: ['status:new', 'date:2026-06-26'],
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<TagInputProps<TagItem>>;

export const Base: Story = {
  render: function Render(args) {
    const { m } = useBreakpoints();

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
        fullWidth
        style={{ inlineSize: m ? 360 : 240 }}
        placeholder="Type and press Enter"
        items={list.items}
        onAdd={(values) => list.append(...values.map(createTag))}
        onRemove={(keys) => list.remove(...keys)}
        {...args}
      >
        {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
      </TagInput>
    );
  },
};

export const Variant: Story = {
  render: function Render() {
    const { m } = useBreakpoints();

    return (
      <FlexBox gap="m" direction="column" style={{ inlineSize: m ? 360 : 240 }}>
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
    const { m } = useBreakpoints();

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
      <FlexBox direction="column" gap="m" style={{ inlineSize: m ? 360 : 240 }}>
        <TagInput<TagItem>
          label="Categories"
          items={categories.items}
          placeholder="Add a category"
          caption="Press Enter or comma to add"
          onRemove={(keys) => categories.remove(...keys)}
          onAdd={(values) => categories.append(...values.map(createCategory))}
          fullWidth
          isRequired
        >
          {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
        </TagInput>
        <TagInput<TagItem>
          label="Tags"
          items={tags.items}
          isInvalid={isEmpty}
          placeholder="Add at least one tag"
          caption={isEmpty ? undefined : 'Looks good'}
          onRemove={(keys) => tags.remove(...keys)}
          onAdd={(values) => tags.append(...values.map(createTag))}
          errorMessage={isEmpty ? 'At least one tag is required' : undefined}
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
    const { m } = useBreakpoints();

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
        items={list.items}
        placeholder="Disabled"
        style={{ inlineSize: m ? 360 : 240 }}
        onRemove={(keys) => list.remove(...keys)}
        onAdd={(values) => list.append(...values.map(createTag))}
        isDisabled
      >
        {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
      </TagInput>
    );
  },
};

export const ReadOnly: Story = {
  render: function Render() {
    const { m } = useBreakpoints();

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
        items={list.items}
        placeholder="Read-only"
        style={{ inlineSize: m ? 360 : 240 }}
        onRemove={(keys) => list.remove(...keys)}
        onAdd={(values) => list.append(...values.map(createTag))}
        isReadOnly
      >
        {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
      </TagInput>
    );
  },
};

export const HideClearButton: Story = {
  render: function Render() {
    const { m } = useBreakpoints();

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
        items={list.items}
        placeholder="Add tag"
        style={{ inlineSize: m ? 360 : 240 }}
        onRemove={(keys) => list.remove(...keys)}
        onAdd={(values) => list.append(...values.map(createTag))}
        hideClearButton
      >
        {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
      </TagInput>
    );
  },
};

export const Addons: Story = {
  render: function Render() {
    const { m } = useBreakpoints();

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
        items={list.items}
        placeholder="Add"
        style={{ inlineSize: m ? 360 : 240 }}
        startAddon={<IconGridSquares16 />}
        endAddon={<IconCircleInfo16 />}
        onRemove={(keys) => list.remove(...keys)}
        onAdd={(values) => list.append(...values.map(createTag))}
      >
        {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
      </TagInput>
    );
  },
};

export const SplitPattern: Story = {
  render: function Render() {
    const { m } = useBreakpoints();

    const list = useListData<TagItem>({ initialItems: [] });
    const tagCounter = useRef(0);

    const createTag = (name: string): TagItem => {
      tagCounter.current += 1;

      return { id: `tag-${tagCounter.current}-${name}`, name };
    };

    return (
      <TagInput<TagItem>
        label="Tags"
        items={list.items}
        splitPattern={/[,;\s]/}
        style={{ inlineSize: m ? 360 : 240 }}
        caption="Try pasting: foo, bar; baz qux"
        placeholder="Use comma, semicolon or space"
        onRemove={(keys) => list.remove(...keys)}
        onAdd={(values) => list.append(...values.map(createTag))}
        fullWidth
      >
        {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
      </TagInput>
    );
  },
};

export const PreventDuplicates: Story = {
  render: function Render() {
    const { m } = useBreakpoints();

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
        items={list.items}
        style={{ inlineSize: m ? 360 : 240 }}
        caption="Duplicates are ignored — try typing React again"
        placeholder="Type and press Enter"
        onAdd={(values) => {
          const existing = new Set(
            list.items.map((item) => item.name.toLowerCase())
          );

          const fresh = values.filter(
            (value) => !existing.has(value.toLowerCase())
          );

          if (fresh.length === 0) return;
          list.append(...fresh.map(createTag));
        }}
        onRemove={(keys) => list.remove(...keys)}
        fullWidth
      >
        {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
      </TagInput>
    );
  },
};

export const Validation: Story = {
  render: function Render() {
    const { m } = useBreakpoints();

    const anchorRef = useRef<HTMLDivElement>(null);

    const list = useListData<TagItem>({
      initialItems: [
        { id: 'first', name: 'First' },
        { id: 'second', name: 'Second' },
      ],
    });

    const tagCounter = useRef(0);
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');
    const [isErrorOpen, setIsErrorOpen] = useState(false);

    useTimeout(() => setIsErrorOpen(false), isErrorOpen ? 2000 : null);

    const createTag = (name: string): TagItem => {
      tagCounter.current += 1;

      return { id: `tag-${tagCounter.current}-${name}`, name };
    };

    return (
      <>
        <TagInput<TagItem>
          label="Tags"
          items={list.items}
          slotProps={{
            group: { ref: anchorRef },
          }}
          inputValue={inputValue}
          placeholder="Letters and digits only"
          style={{ inlineSize: m ? 360 : 240 }}
          onInputChange={(next) => {
            if (!/^[\p{L}\p{N}]*$/u.test(next)) {
              setError('Only letters and digits');
              setIsErrorOpen(true);

              return;
            }

            setIsErrorOpen(false);
            setInputValue(next);
          }}
          onAdd={(values) => list.append(...values.map(createTag))}
          onRemove={(keys) => list.remove(...keys)}
          fullWidth
        >
          {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
        </TagInput>
        <Tooltip
          variant="error"
          placement="top"
          hideArrow={false}
          isOpen={isErrorOpen}
          anchorRef={anchorRef}
          onOpenChange={setIsErrorOpen}
        >
          {error}
        </Tooltip>
      </>
    );
  },
};

export const WithSelection: Story = {
  render: function Render() {
    const { m } = useBreakpoints();

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
      <FlexBox direction="column" gap="s" style={{ inlineSize: m ? 360 : 240 }}>
        <TagInput<TagItem>
          label="Tags"
          items={list.items}
          selectedKeys={selected}
          onSelectionChange={setSelected}
          onRemove={(keys) => list.remove(...keys)}
          placeholder="Click a tag with Cmd/Ctrl, press Space, or Ctrl+A"
          onAdd={(values) => list.append(...values.map(createTag))}
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
    const { m } = useBreakpoints();

    const list = useListData<TagItem>({
      initialItems: [{ id: 'react', name: 'React' }],
    });

    const tagCounter = useRef(0);

    const createTag = (name: string): TagItem => {
      tagCounter.current += 1;

      return { id: `tag-${tagCounter.current}-${name}`, name };
    };

    return (
      <Form
        labelPlacement="side"
        style={{ inlineSize: m ? 360 : 240 }}
        isDisabled
      >
        <TagInput<TagItem>
          label="Tags"
          items={list.items}
          placeholder="Form-wide disabled"
          onRemove={(keys) => list.remove(...keys)}
          onAdd={(values) => list.append(...values.map(createTag))}
        >
          {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
        </TagInput>
        <Form.Actions>
          <Button>Submit</Button>
        </Form.Actions>
      </Form>
    );
  },
};

export const Autofill: Story = {
  render: function Render() {
    const { m } = useBreakpoints();

    const list = useListData<TagItem>({
      initialItems: [{ id: 'react', name: 'React' }],
    });

    const tagCounter = useRef(0);

    const createTag = (name: string): TagItem => {
      tagCounter.current += 1;

      return { id: `tag-${tagCounter.current}-${name}`, name };
    };

    return (
      <FlexBox gap="m" direction="column" style={{ inlineSize: m ? 360 : 240 }}>
        <Typography>
          Click on the text box and choose any option suggested by your browser.
        </Typography>
        <TagInput<TagItem>
          label="Tags"
          id="autofill"
          name="autofill"
          items={list.items}
          placeholder="Type and press Enter"
          onRemove={(keys) => list.remove(...keys)}
          onAdd={(values) => list.append(...values.map(createTag))}
          fullWidth
          disableCommitOnBlur
        >
          {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
        </TagInput>
      </FlexBox>
    );
  },
};
