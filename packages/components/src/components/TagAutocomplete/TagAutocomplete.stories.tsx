import { useRef, useState } from 'react';

import {
  IconCircleInfo16,
  IconGridSquares16,
  IconStar16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { Form } from '../Form';
import { Button, useAsyncList, useBreakpoints, useListData } from '../index';
import { ProgressSpinner } from '../ProgressSpinner';
import { tagInputPropVariant } from '../TagInput';

import { TagAutocomplete } from './index';
import type { TagAutocompleteProps } from './types';

type TagItem = { id: string; name: string };

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

const meta = {
  title: 'Components/TagAutocomplete',
  component: TagAutocomplete,
  subcomponents: {
    'TagAutocomplete.ListItem': TagAutocomplete.ListItem,
    'TagAutocomplete.Tag': TagAutocomplete.Tag,
  },
  parameters: { layout: 'centered' },
  tags: ['status:new', 'date:2026-06-26'],
} satisfies Meta<typeof TagAutocomplete>;

export default meta;
type Story = StoryObj<TagAutocompleteProps<TagItem>>;

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
      <TagAutocomplete<TagItem>
        label="Tags"
        fullWidth
        style={{ inlineSize: m ? 360 : 240 }}
        placeholder="Type or choose a tag"
        disableCommitOnBlur
        {...args}
        items={list.items}
        listItems={technologySuggestions}
        defaultFilter={containsFilter}
        onAdd={(values, context) => {
          if (context.source === 'suggestion') {
            list.append(context.suggestion);

            return;
          }

          list.append(...values.map(createTag));
        }}
        onRemove={(keys) => list.remove(...keys)}
        renderListItem={(item) => (
          <TagAutocomplete.ListItem key={item.id} textValue={item.name}>
            {item.name}
          </TagAutocomplete.ListItem>
        )}
      >
        {(item) => (
          <TagAutocomplete.Tag key={item.id} textValue={item.name}>
            {item.name}
          </TagAutocomplete.Tag>
        )}
      </TagAutocomplete>
    );
  },
};

export const Variant: Story = {
  render: function Render() {
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
      <FlexBox gap="m" direction="column" style={{ inlineSize: m ? 360 : 240 }}>
        {tagInputPropVariant.map((variant) => (
          <TagAutocomplete<TagItem>
            key={variant}
            variant={variant}
            label={variant}
            placeholder={`variant = ${variant}`}
            items={list.items}
            listItems={technologySuggestions}
            defaultFilter={containsFilter}
            onAdd={(values, context) => {
              if (context.source === 'suggestion') {
                list.append(context.suggestion);

                return;
              }

              list.append(...values.map(createTag));
            }}
            onRemove={(keys) => list.remove(...keys)}
            renderListItem={(item) => (
              <TagAutocomplete.ListItem key={item.id} textValue={item.name}>
                {item.name}
              </TagAutocomplete.ListItem>
            )}
            fullWidth
          >
            {(item) => (
              <TagAutocomplete.Tag key={item.id} textValue={item.name}>
                {item.name}
              </TagAutocomplete.Tag>
            )}
          </TagAutocomplete>
        ))}
      </FlexBox>
    );
  },
};

export const FormField: Story = {
  render: function Render() {
    const { m } = useBreakpoints();

    const categoryCounter = useRef(0);
    const tagCounter = useRef(0);

    const categories = useListData<TagItem>({
      initialItems: [
        { id: 'news', name: 'News' },
        { id: 'sports', name: 'Sports' },
      ],
    });

    const tags = useListData<TagItem>({ initialItems: [] });

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
      <Form labelPlacement="side" style={{ inlineSize: m ? 480 : 240 }}>
        <TagAutocomplete<TagItem>
          label="Categories"
          fullWidth
          isRequired
          style={{ inlineSize: '100%' }}
          placeholder="Add a category"
          caption="Choose a suggestion or press Enter"
          items={categories.items}
          listItems={categorySuggestions}
          defaultFilter={containsFilter}
          onAdd={(values, context) => {
            if (context.source === 'suggestion') {
              categories.append(context.suggestion);

              return;
            }

            categories.append(...values.map(createCategory));
          }}
          onRemove={(keys) => categories.remove(...keys)}
          renderListItem={(item) => (
            <TagAutocomplete.ListItem key={item.id} textValue={item.name}>
              {item.name}
            </TagAutocomplete.ListItem>
          )}
        >
          {(item) => (
            <TagAutocomplete.Tag key={item.id} textValue={item.name}>
              {item.name}
            </TagAutocomplete.Tag>
          )}
        </TagAutocomplete>
        <TagAutocomplete<TagItem>
          label="Tags"
          fullWidth
          isInvalid={isEmpty}
          style={{ inlineSize: '100%' }}
          placeholder="Add at least one tag"
          caption={isEmpty ? undefined : 'Looks good'}
          errorMessage={isEmpty ? 'At least one tag is required' : undefined}
          items={tags.items}
          listItems={technologySuggestions}
          defaultFilter={containsFilter}
          onAdd={(values, context) => {
            if (context.source === 'suggestion') {
              tags.append(context.suggestion);

              return;
            }

            tags.append(...values.map(createTag));
          }}
          onRemove={(keys) => tags.remove(...keys)}
          renderListItem={(item) => (
            <TagAutocomplete.ListItem key={item.id} textValue={item.name}>
              {item.name}
            </TagAutocomplete.ListItem>
          )}
        >
          {(item) => (
            <TagAutocomplete.Tag key={item.id} textValue={item.name}>
              {item.name}
            </TagAutocomplete.Tag>
          )}
        </TagAutocomplete>
        <Form.Actions>
          <Button>Submit</Button>
        </Form.Actions>
      </Form>
    );
  },
};

export const SplitPattern: Story = {
  render: function Render() {
    const { m } = useBreakpoints();

    const tagCounter = useRef(0);

    const list = useListData<TagItem>({ initialItems: [] });

    const createTag = (name: string): TagItem => {
      tagCounter.current += 1;

      return { id: `tag-${tagCounter.current}-${name}`, name };
    };

    return (
      <TagAutocomplete<TagItem>
        label="Tags"
        fullWidth
        style={{ inlineSize: m ? 360 : 240 }}
        splitPattern={/[,;\s]/}
        caption="Try pasting: foo, bar; baz qux"
        placeholder="Use comma, semicolon or space"
        items={list.items}
        listItems={technologySuggestions}
        defaultFilter={containsFilter}
        onAdd={(values, context) => {
          if (context.source === 'suggestion') {
            list.append(context.suggestion);

            return;
          }

          list.append(...values.map(createTag));
        }}
        onRemove={(keys) => list.remove(...keys)}
        renderListItem={(item) => (
          <TagAutocomplete.ListItem key={item.id} textValue={item.name}>
            {item.name}
          </TagAutocomplete.ListItem>
        )}
      >
        {(item) => (
          <TagAutocomplete.Tag key={item.id} textValue={item.name}>
            {item.name}
          </TagAutocomplete.Tag>
        )}
      </TagAutocomplete>
    );
  },
};

export const PreventDuplicates: Story = {
  render: function Render() {
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
      <TagAutocomplete<TagItem>
        label="Tags"
        fullWidth
        style={{ inlineSize: m ? 360 : 240 }}
        caption="Free-form duplicates are ignored — suggestions are excluded automatically"
        placeholder="Type React again or choose a suggestion"
        items={list.items}
        listItems={technologySuggestions}
        defaultFilter={containsFilter}
        onAdd={(values, context) => {
          if (context.source === 'suggestion') {
            list.append(context.suggestion);

            return;
          }

          const existing = new Set(
            list.items.map((item) => item.name.toLocaleLowerCase())
          );

          const fresh = values.filter(
            (value) => !existing.has(value.toLocaleLowerCase())
          );

          if (fresh.length === 0) return;

          list.append(...fresh.map(createTag));
        }}
        onRemove={(keys) => list.remove(...keys)}
        renderListItem={(item) => (
          <TagAutocomplete.ListItem key={item.id} textValue={item.name}>
            {item.name}
          </TagAutocomplete.ListItem>
        )}
      >
        {(item) => (
          <TagAutocomplete.Tag key={item.id} textValue={item.name}>
            {item.name}
          </TagAutocomplete.Tag>
        )}
      </TagAutocomplete>
    );
  },
};

const CREATE_TAG_ID = 'create-tag';

export const CreateOption: Story = {
  render: function Render() {
    const { m } = useBreakpoints();

    const tagCounter = useRef(0);

    const [inputValue, setInputValue] = useState('');

    const list = useListData<TagItem>({
      initialItems: [{ id: 'react', name: 'React' }],
    });

    const createTag = (name: string): TagItem => {
      tagCounter.current += 1;

      return { id: `tag-${tagCounter.current}-${name}`, name };
    };

    const query = inputValue.trim();

    const taken = [...technologySuggestions, ...list.items].some(
      (item) => item.name.toLocaleLowerCase() === query.toLocaleLowerCase()
    );

    const listItems =
      query && !taken
        ? [{ id: CREATE_TAG_ID, name: query }, ...technologySuggestions]
        : technologySuggestions;

    return (
      <TagAutocomplete<TagItem>
        label="Tags"
        fullWidth
        style={{ inlineSize: m ? 360 : 240 }}
        placeholder="Type a value that is not in the list"
        caption="The first option offers to create the typed value"
        items={list.items}
        listItems={listItems}
        inputValue={inputValue}
        onInputChange={setInputValue}
        defaultFilter={containsFilter}
        onAdd={(values, context) => {
          if (context.source === 'suggestion') {
            const { suggestion } = context;

            if (suggestion.id === CREATE_TAG_ID) {
              list.append(createTag(suggestion.name));

              return;
            }

            list.append(suggestion);

            return;
          }

          list.append(...values.map(createTag));
        }}
        onRemove={(keys) => list.remove(...keys)}
        renderListItem={(item) => (
          <TagAutocomplete.ListItem key={item.id} textValue={item.name}>
            {item.id === CREATE_TAG_ID ? `Create: ${item.name}` : item.name}
          </TagAutocomplete.ListItem>
        )}
      >
        {(item) => (
          <TagAutocomplete.Tag key={item.id} textValue={item.name}>
            {item.name}
          </TagAutocomplete.Tag>
        )}
      </TagAutocomplete>
    );
  },
};

export const Disabled: Story = {
  render: function Render() {
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
      <TagAutocomplete<TagItem>
        label="Tags"
        fullWidth
        isDisabled
        placeholder="Disabled"
        style={{ inlineSize: m ? 360 : 240 }}
        items={list.items}
        listItems={technologySuggestions}
        defaultFilter={containsFilter}
        onAdd={(values, context) => {
          if (context.source === 'suggestion') {
            list.append(context.suggestion);

            return;
          }

          list.append(...values.map(createTag));
        }}
        onRemove={(keys) => list.remove(...keys)}
        renderListItem={(item) => (
          <TagAutocomplete.ListItem key={item.id} textValue={item.name}>
            {item.name}
          </TagAutocomplete.ListItem>
        )}
      >
        {(item) => (
          <TagAutocomplete.Tag key={item.id} textValue={item.name}>
            {item.name}
          </TagAutocomplete.Tag>
        )}
      </TagAutocomplete>
    );
  },
};

export const ReadOnly: Story = {
  render: function Render() {
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
      <TagAutocomplete<TagItem>
        label="Tags"
        fullWidth
        isReadOnly
        placeholder="Read-only"
        style={{ inlineSize: m ? 360 : 240 }}
        items={list.items}
        listItems={technologySuggestions}
        defaultFilter={containsFilter}
        onAdd={(values, context) => {
          if (context.source === 'suggestion') {
            list.append(context.suggestion);

            return;
          }

          list.append(...values.map(createTag));
        }}
        onRemove={(keys) => list.remove(...keys)}
        renderListItem={(item) => (
          <TagAutocomplete.ListItem key={item.id} textValue={item.name}>
            {item.name}
          </TagAutocomplete.ListItem>
        )}
      >
        {(item) => (
          <TagAutocomplete.Tag key={item.id} textValue={item.name}>
            {item.name}
          </TagAutocomplete.Tag>
        )}
      </TagAutocomplete>
    );
  },
};

export const HideClearButton: Story = {
  render: function Render() {
    const { m } = useBreakpoints();

    const tagCounter = useRef(0);

    const list = useListData<TagItem>({
      initialItems: [
        { id: 'react', name: 'React' },
        { id: 'typescript', name: 'TypeScript' },
        { id: 'storybook', name: 'Storybook' },
      ],
    });

    const createTag = (name: string): TagItem => {
      tagCounter.current += 1;

      return { id: `tag-${tagCounter.current}-${name}`, name };
    };

    return (
      <TagAutocomplete<TagItem>
        label="Tags"
        fullWidth
        hideClearButton
        style={{ inlineSize: m ? 360 : 240 }}
        placeholder="Type or choose a tag"
        items={list.items}
        listItems={technologySuggestions}
        defaultFilter={containsFilter}
        onAdd={(values, context) => {
          if (context.source === 'suggestion') {
            list.append(context.suggestion);

            return;
          }

          list.append(...values.map(createTag));
        }}
        onRemove={(keys) => list.remove(...keys)}
        renderListItem={(item) => (
          <TagAutocomplete.ListItem key={item.id} textValue={item.name}>
            {item.name}
          </TagAutocomplete.ListItem>
        )}
      >
        {(item) => (
          <TagAutocomplete.Tag key={item.id} textValue={item.name}>
            {item.name}
          </TagAutocomplete.Tag>
        )}
      </TagAutocomplete>
    );
  },
};

export const Addons: Story = {
  render: function Render() {
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
      <TagAutocomplete<TagItem>
        label="Tags"
        fullWidth
        style={{ inlineSize: m ? 360 : 240 }}
        placeholder="Add"
        startAddon={<IconGridSquares16 />}
        endAddon={<IconCircleInfo16 />}
        items={list.items}
        listItems={technologySuggestions}
        defaultFilter={containsFilter}
        onAdd={(values, context) => {
          if (context.source === 'suggestion') {
            list.append(context.suggestion);

            return;
          }

          list.append(...values.map(createTag));
        }}
        onRemove={(keys) => list.remove(...keys)}
        renderListItem={(item) => (
          <TagAutocomplete.ListItem key={item.id} textValue={item.name}>
            {item.name}
          </TagAutocomplete.ListItem>
        )}
      >
        {(item) => (
          <TagAutocomplete.Tag key={item.id} textValue={item.name}>
            {item.name}
          </TagAutocomplete.Tag>
        )}
      </TagAutocomplete>
    );
  },
};

export const CustomTags: Story = {
  render: function Render() {
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
      <TagAutocomplete<TagItem>
        label="Tags"
        fullWidth
        style={{ inlineSize: m ? 360 : 240 }}
        placeholder="Type or choose a tag"
        caption="Each tag uses the warning-fade variant and a leading star icon"
        items={list.items}
        listItems={technologySuggestions}
        defaultFilter={containsFilter}
        onAdd={(values, context) => {
          if (context.source === 'suggestion') {
            list.append(context.suggestion);

            return;
          }

          list.append(...values.map(createTag));
        }}
        onRemove={(keys) => list.remove(...keys)}
        renderListItem={(item) => (
          <TagAutocomplete.ListItem key={item.id} textValue={item.name}>
            {item.name}
          </TagAutocomplete.ListItem>
        )}
      >
        {(item) => (
          <TagAutocomplete.Tag
            key={item.id}
            icon={<IconStar16 />}
            variant="warning-fade"
            textValue={item.name}
          >
            {item.name}
          </TagAutocomplete.Tag>
        )}
      </TagAutocomplete>
    );
  },
};

export const MultiPick: Story = {
  render: function Render() {
    const { m } = useBreakpoints();

    const tagCounter = useRef(0);

    const list = useListData<TagItem>({ initialItems: [] });

    const createTag = (name: string): TagItem => {
      tagCounter.current += 1;

      return { id: `tag-${tagCounter.current}-${name}`, name };
    };

    return (
      <TagAutocomplete<TagItem>
        label="Tags"
        fullWidth
        disableCloseOnSelect
        style={{ inlineSize: m ? 360 : 240 }}
        caption="Popover stays open after selection — pick several tags in a row"
        placeholder="Pick multiple suggestions without closing the menu"
        items={list.items}
        listItems={technologySuggestions}
        defaultFilter={containsFilter}
        onAdd={(values, context) => {
          if (context.source === 'suggestion') {
            list.append(context.suggestion);

            return;
          }

          list.append(...values.map(createTag));
        }}
        onRemove={(keys) => list.remove(...keys)}
        renderListItem={(item) => (
          <TagAutocomplete.ListItem key={item.id} textValue={item.name}>
            {item.name}
          </TagAutocomplete.ListItem>
        )}
      >
        {(item) => (
          <TagAutocomplete.Tag key={item.id} textValue={item.name}>
            {item.name}
          </TagAutocomplete.Tag>
        )}
      </TagAutocomplete>
    );
  },
};

export const ServerSearch: Story = {
  render: function Render() {
    const { m } = useBreakpoints();

    type Product = { id: string; title: string };

    const tagCounter = useRef(0);

    const tags = useListData<Product>({ initialItems: [] });

    // `useAsyncList` loads suggestions from the server and re-fetches whenever
    // `setFilterText` runs; it tracks `isLoading` and aborts stale requests.
    // No `defaultFilter` is passed below — the server already filtered.
    const suggestions = useAsyncList<Product>({
      async load({ signal, filterText }) {
        if (!filterText?.trim()) return { items: [] };

        const url = new URL('https://dummyjson.com/products/search');

        url.searchParams.set('q', filterText);
        url.searchParams.set('limit', '10');

        const res = await fetch(url.toString(), { signal });

        if (!res.ok) throw new Error('DummyJSON error');

        const data = await res.json();
        const products: { id: number; title: string }[] = data.products ?? [];

        return {
          items: products.map((product) => ({
            id: String(product.id),
            title: product.title,
          })),
        };
      },
    });

    const createTag = (title: string): Product => {
      tagCounter.current += 1;

      return { id: `custom-${tagCounter.current}-${title}`, title };
    };

    return (
      <TagAutocomplete<Product>
        label="Products"
        fullWidth
        style={{ inlineSize: m ? 360 : 240 }}
        placeholder="Search products on the server…"
        caption="Suggestions are fetched from dummyjson.com as you type"
        items={tags.items}
        listItems={suggestions.items}
        isInvalid={Boolean(suggestions.error)}
        errorMessage={suggestions.error ? 'Request failed!' : undefined}
        endAddon={suggestions.isLoading ? <ProgressSpinner /> : undefined}
        onInputChange={suggestions.setFilterText}
        onAdd={(values, context) => {
          if (context.source === 'suggestion') {
            tags.append(context.suggestion);

            return;
          }

          tags.append(...values.map(createTag));
        }}
        onRemove={(keys) => tags.remove(...keys)}
        renderListItem={(item) => (
          <TagAutocomplete.ListItem key={item.id} textValue={item.title}>
            {item.title}
          </TagAutocomplete.ListItem>
        )}
      >
        {(item) => (
          <TagAutocomplete.Tag key={item.id} textValue={item.title}>
            {item.title}
          </TagAutocomplete.Tag>
        )}
      </TagAutocomplete>
    );
  },
};

export const AsynchronousLoading: Story = {
  render: function Render() {
    const { m } = useBreakpoints();

    type Product = { id: string; title: string };

    const ITEMS_PER_PAGE = 20;

    const tagCounter = useRef(0);

    const tags = useListData<Product>({ initialItems: [] });

    const [hasMore, setHasMore] = useState(false);

    const suggestions = useAsyncList<Product, number>({
      async load({ signal, cursor, filterText }) {
        if (!filterText?.trim()) {
          setHasMore(false);

          return { items: [] };
        }

        const skip = cursor ?? 0;
        const url = new URL('https://dummyjson.com/products/search');

        url.searchParams.set('q', filterText);
        url.searchParams.set('limit', String(ITEMS_PER_PAGE));
        url.searchParams.set('skip', String(skip));

        const res = await fetch(url.toString(), { signal });
        const data = await res.json();
        const products: { id: number; title: string }[] = data.products ?? [];

        const items = products.map((product) => ({
          id: String(product.id),
          title: product.title,
        }));

        const nextSkip = skip + items.length;
        const more = nextSkip < (data.total ?? 0);

        setHasMore(more);

        return { items, cursor: more ? nextSkip : undefined };
      },
    });

    const createTag = (title: string): Product => {
      tagCounter.current += 1;

      return { id: `custom-${tagCounter.current}-${title}`, title };
    };

    return (
      <TagAutocomplete<Product>
        label="Products"
        fullWidth
        // Keep the empty popover hidden until the user has typed something.
        allowsEmptyCollection={suggestions.filterText.trim() !== ''}
        style={{ inlineSize: m ? 360 : 240 }}
        placeholder="Search — scroll the list to load more"
        caption="Paginated suggestions from dummyjson.com (infinite scroll)"
        items={tags.items}
        listItems={suggestions.items}
        isLoading={hasMore}
        onLoadMore={suggestions.loadMore}
        onInputChange={suggestions.setFilterText}
        onAdd={(values, context) => {
          if (context.source === 'suggestion') {
            tags.append(context.suggestion);

            return;
          }

          tags.append(...values.map(createTag));
        }}
        onRemove={(keys) => tags.remove(...keys)}
        renderListItem={(item) => (
          <TagAutocomplete.ListItem key={item.id} textValue={item.title}>
            {item.title}
          </TagAutocomplete.ListItem>
        )}
      >
        {(item) => (
          <TagAutocomplete.Tag key={item.id} textValue={item.title}>
            {item.title}
          </TagAutocomplete.Tag>
        )}
      </TagAutocomplete>
    );
  },
};
