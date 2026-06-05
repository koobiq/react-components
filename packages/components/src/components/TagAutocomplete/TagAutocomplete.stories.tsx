import { useRef } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { Form } from '../Form';
import { Button, useBreakpoints, useListData } from '../index';
import { tagInputPropVariant } from '../TagInput';

import { TagAutocomplete } from './index';
import type { TagAutocompleteProps } from './types';

type TagItem = { id: string; name: string };

const defaultTags: TagItem[] = [
  { id: 'react', name: 'React' },
  { id: 'typescript', name: 'TypeScript' },
];

const technologySuggestions: TagItem[] = [
  { id: 'react', name: 'React' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'storybook', name: 'Storybook' },
  { id: 'vite', name: 'Vite' },
  { id: 'vitest', name: 'Vitest' },
  { id: 'playwright', name: 'Playwright' },
];

const categorySuggestions: TagItem[] = [
  { id: 'news', name: 'News' },
  { id: 'sports', name: 'Sports' },
  { id: 'security', name: 'Security' },
  { id: 'research', name: 'Research' },
];

const containsFilter = (textValue: string, inputValue: string) =>
  textValue.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase());

const renderTag = (item: TagItem) => (
  <TagAutocomplete.Tag key={item.id} textValue={item.name}>
    {item.name}
  </TagAutocomplete.Tag>
);

const renderListItem = (item: TagItem) => (
  <TagAutocomplete.ListItem key={item.id} textValue={item.name}>
    {item.name}
  </TagAutocomplete.ListItem>
);

type ExampleTagAutocompleteProps = Omit<
  TagAutocompleteProps<TagItem>,
  'items' | 'children' | 'onAdd' | 'onRemove' | 'listItems' | 'renderListItem'
> & {
  initialItems?: TagItem[];
  suggestions?: TagItem[];
  allowDuplicateFreeform?: boolean;
};

function ExampleTagAutocomplete(props: ExampleTagAutocompleteProps) {
  const {
    initialItems = defaultTags,
    suggestions = technologySuggestions,
    allowDuplicateFreeform = true,
    defaultFilter = containsFilter,
    style,
    ...tagAutocompleteProps
  } = props;

  const { m } = useBreakpoints();

  const counter = useRef(0);

  const tags = useListData<TagItem>({
    initialItems,
    getKey: (item) => item.id,
  });

  const createTag = (name: string): TagItem => {
    counter.current += 1;

    return { id: `tag-${counter.current}-${name}`, name };
  };

  return (
    <TagAutocomplete<TagItem>
      label="Tags"
      fullWidth
      style={{ inlineSize: m ? 360 : 240, ...style }}
      placeholder="Type or choose a tag"
      items={tags.items}
      onAdd={(values, context) => {
        if (context.source === 'suggestion') {
          tags.append(context.suggestion);

          return;
        }

        let nextValues = values;

        if (!allowDuplicateFreeform) {
          const existing = new Set(
            tags.items.map((item) => item.name.toLocaleLowerCase())
          );

          nextValues = values.filter(
            (value) => !existing.has(value.toLocaleLowerCase())
          );
        }

        if (nextValues.length === 0) return;

        tags.append(...nextValues.map(createTag));
      }}
      onRemove={(keys) => tags.remove(...keys)}
      listItems={suggestions}
      renderListItem={renderListItem}
      defaultFilter={defaultFilter}
      {...tagAutocompleteProps}
    >
      {renderTag}
    </TagAutocomplete>
  );
}

const meta = {
  title: 'Components/TagAutocomplete',
  component: TagAutocomplete,
  subcomponents: {
    'TagAutocomplete.ListItem': TagAutocomplete.ListItem,
    'TagAutocomplete.Tag': TagAutocomplete.Tag,
  },
  parameters: { layout: 'centered' },
  tags: ['status:new', 'date:2026-06-01'],
} satisfies Meta<typeof TagAutocomplete>;

export default meta;
type Story = StoryObj<TagAutocompleteProps<TagItem>>;

export const Base: Story = {
  render: function Render(args) {
    return <ExampleTagAutocomplete disableCommitOnBlur {...args} />;
  },
};

export const Variant: Story = {
  render: function Render() {
    const { m } = useBreakpoints();

    return (
      <FlexBox gap="m" direction="column" style={{ inlineSize: m ? 360 : 240 }}>
        {tagInputPropVariant.map((variant) => (
          <ExampleTagAutocomplete
            key={variant}
            variant={variant}
            label={variant}
            aria-label={`variant-${variant}`}
            placeholder={`variant = ${variant}`}
          />
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
      getKey: (item) => item.id,
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
        <TagAutocomplete<TagItem>
          label="Categories"
          items={categories.items}
          placeholder="Add a category"
          caption="Choose a suggestion or press Enter"
          onRemove={(keys) => categories.remove(...keys)}
          onAdd={(values, context) => {
            if (context.source === 'suggestion') {
              categories.append(context.suggestion);
            } else {
              categories.append(...values.map(createCategory));
            }
          }}
          listItems={categorySuggestions}
          renderListItem={renderListItem}
          defaultFilter={containsFilter}
          fullWidth
          isRequired
        >
          {renderTag}
        </TagAutocomplete>
        <TagAutocomplete<TagItem>
          label="Tags"
          items={tags.items}
          isInvalid={isEmpty}
          placeholder="Add at least one tag"
          caption={isEmpty ? undefined : 'Looks good'}
          onRemove={(keys) => tags.remove(...keys)}
          onAdd={(values, context) => {
            if (context.source === 'suggestion') {
              tags.append(context.suggestion);
            } else {
              tags.append(...values.map(createTag));
            }
          }}
          listItems={technologySuggestions}
          renderListItem={renderListItem}
          defaultFilter={containsFilter}
          errorMessage={isEmpty ? 'At least one tag is required' : undefined}
          fullWidth
        >
          {renderTag}
        </TagAutocomplete>
      </FlexBox>
    );
  },
};

export const SplitPattern: Story = {
  render: function Render() {
    return (
      <ExampleTagAutocomplete
        initialItems={[]}
        splitPattern={/[,;\s]/}
        caption="Try pasting: foo, bar; baz qux"
        placeholder="Use comma, semicolon or space"
      />
    );
  },
};

export const PreventDuplicates: Story = {
  render: function Render() {
    return (
      <ExampleTagAutocomplete
        caption="Free-form duplicates are ignored — suggestions are excluded automatically"
        placeholder="Type React again or choose a suggestion"
        allowDuplicateFreeform={false}
      />
    );
  },
};

export const Disabled: Story = {
  render: function Render() {
    return <ExampleTagAutocomplete placeholder="Disabled" isDisabled />;
  },
};

export const ReadOnly: Story = {
  render: function Render() {
    return <ExampleTagAutocomplete placeholder="Read-only" isReadOnly />;
  },
};

export const Clearable: Story = {
  render: function Render() {
    return (
      <ExampleTagAutocomplete
        initialItems={[...defaultTags, { id: 'storybook', name: 'Storybook' }]}
        isClearable
      />
    );
  },
};

export const MultiPick: Story = {
  render: function Render() {
    return (
      <ExampleTagAutocomplete
        initialItems={[]}
        caption="Popover stays open after selection — pick several tags in a row"
        placeholder="Pick multiple suggestions without closing the menu"
        disableCloseOnSelect
      />
    );
  },
};

export const InsideForm: Story = {
  render: function Render() {
    const { m } = useBreakpoints();

    return (
      <Form
        labelPlacement="side"
        style={{ inlineSize: m ? 360 : 240 }}
        isDisabled
      >
        <ExampleTagAutocomplete
          label="Tags"
          placeholder="Form-wide disabled"
          style={{ inlineSize: '100%' }}
        />
        <Form.Actions>
          <Button>Submit</Button>
        </Form.Actions>
      </Form>
    );
  },
};
