import { useRef } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { useListData } from '../index';
import { TagInput } from '../TagInput';

import { TagAutocomplete } from './index';
import type { TagAutocompleteProps } from './types';

type TagItem = { id: string; name: string };

const meta = {
  title: 'Components/TagAutocomplete',
  component: TagAutocomplete,
  subcomponents: {
    'TagAutocomplete.List': TagAutocomplete.List,
    'TagAutocomplete.Item': TagAutocomplete.Item,
  },
  parameters: { layout: 'centered' },
  tags: ['status:new', 'date:2026-06-01'],
} satisfies Meta<typeof TagAutocomplete>;

export default meta;
type Story = StoryObj<TagAutocompleteProps>;

export const Base: Story = {
  render: function Render() {
    const counter = useRef(0);

    const tags = useListData<TagItem>({
      initialItems: [
        { id: 'react', name: 'React' },
        { id: 'typescript', name: 'TypeScript' },
      ],
    });

    const suggestions = useListData<TagItem>({
      initialItems: [
        { id: 'react', name: 'React' },
        { id: 'typescript', name: 'TypeScript' },
        { id: 'storybook', name: 'Storybook' },
        { id: 'vite', name: 'Vite' },
        { id: 'vitest', name: 'Vitest' },
      ],
    });

    const createTag = (name: string): TagItem => {
      counter.current += 1;

      return { id: `tag-${counter.current}-${name}`, name };
    };

    return (
      <TagAutocomplete<TagItem>
        onSelect={(item) => tags.append(createTag(item.name))}
      >
        <TagInput<TagItem>
          label="Tags"
          fullWidth
          items={tags.items}
          style={{ inlineSize: 360 }}
          placeholder="Type and press Enter"
          onAdd={(values) => tags.append(...values.map(createTag))}
          onRemove={(keys) => tags.remove(...keys)}
        >
          {(item) => (
            <TagInput.Tag key={item.id} textValue={item.name}>
              {item.name}
            </TagInput.Tag>
          )}
        </TagInput>
        <TagAutocomplete.List<TagItem> items={suggestions.items}>
          {(item) => (
            <TagAutocomplete.Item key={item.id} textValue={item.name}>
              {item.name}
            </TagAutocomplete.Item>
          )}
        </TagAutocomplete.List>
      </TagAutocomplete>
    );
  },
};
