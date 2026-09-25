import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import controlGroup from '../FormField/FormFieldControlGroup/FormFieldControlGroup.module.css';

import { SearchInput, searchInputPropVariant } from './index.js';
import type { SearchInputProps } from './index.js';

const meta = {
  title: 'E2E/SearchInput',
  component: SearchInput,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof SearchInput>;

export default meta;

type Story = StoryObj<typeof SearchInput>;

type State = { title: string } & SearchInputProps;

// React Aria sets focus only on interaction, so the control group's class is forced.
const states: State[] = [
  { title: 'normal' },
  { title: 'focus', slotProps: { group: { className: controlGroup.focused } } },
  { title: 'disabled', isDisabled: true },
  { title: 'readonly', isReadOnly: true },
  { title: 'invalid', isInvalid: true, errorMessage: 'Error message' },
];

const values: SearchInputProps[] = [{}, { defaultValue: 'Value' }];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {searchInputPropVariant.flatMap((variant) =>
        values.flatMap((value, index) =>
          states.map(({ title, ...state }) => (
            <SearchInput
              key={`${variant}-${index}-${title}`}
              label={title}
              variant={variant}
              placeholder="Placeholder"
              {...value}
              {...state}
            />
          ))
        )
      )}
    </E2eGrid>
  ),
};
