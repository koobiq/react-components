import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import controlGroup from '../FormField/FormFieldControlGroup/FormFieldControlGroup.module.css';

import { TagInput, tagInputPropVariant } from './index.js';
import type { TagInputProps } from './index.js';

const meta = {
  title: 'E2E/TagInput',
  component: TagInput,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof TagInput>;

export default meta;

type Story = StoryObj<typeof TagInput>;

type Item = { id: string; name: string };

type State = { title: string } & Partial<TagInputProps<Item>>;

// React Aria sets focus only on interaction, so the control group's class is forced.
const states: State[] = [
  { title: 'normal' },
  { title: 'focus', slotProps: { group: { className: controlGroup.focused } } },
  { title: 'disabled', isDisabled: true },
  { title: 'readonly', isReadOnly: true },
  { title: 'invalid', isInvalid: true, errorMessage: 'Error message' },
];

const values: Partial<TagInputProps<Item>>[] = [
  { items: [] },
  {
    items: [
      { id: 'one', name: 'One' },
      { id: 'two', name: 'Two' },
    ],
  },
];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {tagInputPropVariant.flatMap((variant) =>
        values.flatMap((value, index) =>
          states.map(({ title, ...state }) => (
            <TagInput<Item>
              key={`${variant}-${index}-${title}`}
              label={title}
              variant={variant}
              placeholder="Placeholder"
              {...value}
              {...state}
            >
              {(item) => <TagInput.Tag key={item.id}>{item.name}</TagInput.Tag>}
            </TagInput>
          ))
        )
      )}
    </E2eGrid>
  ),
};
