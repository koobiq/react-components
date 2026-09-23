import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import controlGroup from '../FormField/FormFieldControlGroup/FormFieldControlGroup.module.css';
import { tagInputPropVariant } from '../TagInput';

import { TagAutocomplete } from './index.js';
import type { TagAutocompleteProps } from './index.js';

const meta = {
  title: 'E2E/TagAutocomplete',
  component: TagAutocomplete,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof TagAutocomplete>;

export default meta;

type Story = StoryObj<typeof TagAutocomplete>;

type Item = { id: string; name: string };

type State = { title: string } & Partial<TagAutocompleteProps<Item>>;

const listItems: Item[] = [
  { id: 'malware', name: 'Malware' },
  { id: 'phishing', name: 'Phishing' },
  { id: 'ransomware', name: 'Ransomware' },
];

// React Aria sets focus only on interaction, so the control group's class is forced.
const states: State[] = [
  { title: 'normal' },
  {
    title: 'focus',
    slotProps: {
      tagInput: { slotProps: { group: { className: controlGroup.focused } } },
    },
  },
  { title: 'disabled', isDisabled: true },
  { title: 'readonly', isReadOnly: true },
  { title: 'invalid', isInvalid: true, errorMessage: 'Error message' },
];

const values: Partial<TagAutocompleteProps<Item>>[] = [
  { items: [] },
  { items: listItems.slice(0, 2) },
];

const renderListItem = (item: Item) => (
  <TagAutocomplete.ListItem key={item.id}>{item.name}</TagAutocomplete.ListItem>
);

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {tagInputPropVariant.flatMap((variant) =>
        values.flatMap((value, index) =>
          states.map(({ title, ...state }) => (
            <TagAutocomplete<Item>
              key={`${variant}-${index}-${title}`}
              label={title}
              variant={variant}
              placeholder="Placeholder"
              listItems={listItems}
              renderListItem={renderListItem}
              {...value}
              {...state}
            >
              {(item) => (
                <TagAutocomplete.Tag key={item.id}>
                  {item.name}
                </TagAutocomplete.Tag>
              )}
            </TagAutocomplete>
          ))
        )
      )}
    </E2eGrid>
  ),
};

export const Open: Story = {
  render: () => (
    <TagAutocomplete<Item>
      aria-label="Tags"
      defaultOpen
      items={[]}
      listItems={listItems}
      renderListItem={renderListItem}
      style={{ inlineSize: 200 }}
      slotProps={{ popover: { 'data-testid': 'e2eScreenshotTarget' } }}
    >
      {(item) => (
        <TagAutocomplete.Tag key={item.id}>{item.name}</TagAutocomplete.Tag>
      )}
    </TagAutocomplete>
  ),
};
