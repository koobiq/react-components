import { useRef } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { useListData } from '../index';

import { TagAutocomplete } from './index';
import type { TagAutocompleteProps } from './types';

type TagItem = { id: string; name: string };

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
        label="Tags"
        items={tags.items}
        style={{ inlineSize: 360 }}
        placeholder="Type and press Enter"
        onAdd={(values, context) => {
          if (context.source === 'suggestion') {
            tags.append(context.suggestion);
          } else {
            tags.append(...values.map(createTag));
          }
        }}
        onRemove={(keys) => tags.remove(...keys)}
        listItems={suggestions.items}
        renderListItem={(item) => (
          <TagAutocomplete.ListItem key={item.id} textValue={item.name}>
            {item.name}
          </TagAutocomplete.ListItem>
        )}
        defaultFilter={(textValue, inputValue) =>
          textValue.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())
        }
        fullWidth
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
