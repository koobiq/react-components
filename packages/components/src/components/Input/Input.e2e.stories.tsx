import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import controlGroup from '../FormField/FormFieldControlGroup/FormFieldControlGroup.module.css';

import { Input, inputPropVariant } from './index.js';
import type { InputProps } from './index.js';

const meta = {
  title: 'E2E/Input',
  component: Input,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof Input>;

type State = { title: string } & InputProps;

// React Aria sets focus only on interaction, so the control group's class is forced.
const states: State[] = [
  { title: 'normal' },
  { title: 'focus', slotProps: { group: { className: controlGroup.focused } } },
  { title: 'disabled', isDisabled: true },
  { title: 'readonly', isReadOnly: true },
  { title: 'invalid', isInvalid: true, errorMessage: 'Error message' },
];

const values: InputProps[] = [{}, { defaultValue: 'Value' }];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {inputPropVariant.flatMap((variant) =>
        values.flatMap((value, index) =>
          states.map(({ title, ...state }) => (
            <Input
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
