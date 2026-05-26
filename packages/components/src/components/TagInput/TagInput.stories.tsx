import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { Form } from '../Form';
import { Typography } from '../Typography';

import { TagInput } from './TagInput';
import { tagInputPropVariant } from './types';

const meta = {
  title: 'Components/TagInput',
  component: TagInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['status:new', 'date:2026-05-25'],
} satisfies Meta<typeof TagInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const style = { inlineSize: '100%', maxInlineSize: 360 };

export const Base: Story = {
  render: (args) => (
    <TagInput
      label="Tags"
      style={style}
      placeholder="Type and press Enter"
      defaultValue={['React', 'TypeScript']}
      {...args}
    />
  ),
};

export const Controlled: Story = {
  render: function Render() {
    const [tags, setTags] = useState<string[]>(['React', 'TypeScript']);
    const [inputValue, setInputValue] = useState('');

    return (
      <FlexBox gap="s" style={style} direction="column">
        <TagInput
          label="Tags"
          value={tags}
          onChange={setTags}
          placeholder="Add more"
          inputValue={inputValue}
          onInputChange={setInputValue}
          fullWidth
        />
        <Typography>Tags: {tags.join(', ') || '(none)'}</Typography>
      </FlexBox>
    );
  },
};

export const Variant: Story = {
  render: (args) => (
    <FlexBox direction="column" gap="m" style={style}>
      {tagInputPropVariant.map((variant) => (
        <TagInput
          key={variant}
          variant={variant}
          aria-label={`variant-${variant}`}
          placeholder={`variant = ${variant}`}
          defaultValue={['One', 'Two']}
          fullWidth
          {...args}
        />
      ))}
    </FlexBox>
  ),
};

export const FormField: Story = {
  render: function Render() {
    const [tags, setTags] = useState<string[]>([]);
    const isEmpty = tags.length === 0;

    return (
      <FlexBox direction="column" gap="m" style={style}>
        <TagInput
          label="Categories"
          caption="Press Enter or comma to add"
          placeholder="Add a category"
          defaultValue={['News', 'Sports']}
          isRequired
          fullWidth
        />
        <TagInput
          label="Tags"
          value={tags}
          onChange={setTags}
          placeholder="Add at least one tag"
          isInvalid={isEmpty}
          errorMessage={isEmpty ? 'At least one tag is required' : undefined}
          caption={isEmpty ? undefined : 'Looks good'}
          fullWidth
        />
      </FlexBox>
    );
  },
};

export const Disabled: Story = {
  render: (args) => (
    <TagInput
      label="Tags"
      style={style}
      placeholder="Disabled"
      defaultValue={['React', 'TypeScript']}
      isDisabled
      {...args}
    />
  ),
};

export const ReadOnly: Story = {
  render: (args) => (
    <TagInput
      label="Tags"
      style={style}
      placeholder="Read-only"
      defaultValue={['React', 'TypeScript']}
      isReadOnly
      {...args}
    />
  ),
};

export const Clearable: Story = {
  render: (args) => (
    <TagInput
      label="Tags"
      style={style}
      placeholder="Type and press Enter"
      defaultValue={['React', 'TypeScript', 'Storybook']}
      isClearable
      {...args}
    />
  ),
};

export const SplitPattern: Story = {
  render: (args) => (
    <TagInput
      label="Tags"
      style={style}
      splitPattern={/[,;\s]/}
      caption="Try pasting: foo, bar; baz qux"
      placeholder="Use comma, semicolon or space"
      fullWidth
      {...args}
    />
  ),
};

export const MaxWidth: Story = {
  render: (args) => (
    <TagInput
      label="Tags"
      style={style}
      placeholder="More tags…"
      defaultValue={[
        'React',
        'TypeScript',
        'Storybook',
        'Vite',
        'Vitest',
        'Lightning CSS',
        'ESLint',
        'Prettier',
      ]}
      fullWidth
      {...args}
    />
  ),
};

export const InsideForm: Story = {
  render: (args) => (
    <Form isDisabled style={style}>
      <TagInput
        label="Tags"
        defaultValue={['React']}
        placeholder="Form-wide disabled"
        {...args}
      />
    </Form>
  ),
};
