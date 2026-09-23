import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import controlGroup from '../FormField/FormFieldControlGroup/FormFieldControlGroup.module.css';

import { InputNumber, inputNumberPropVariant } from './index.js';
import type { InputNumberProps } from './index.js';

const meta = {
  title: 'E2E/InputNumber',
  component: InputNumber,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof InputNumber>;

export default meta;

type Story = StoryObj<typeof InputNumber>;

type State = { title: string } & InputNumberProps;

// React Aria sets focus only on interaction, so the control group's class is forced.
const states: State[] = [
  { title: 'normal' },
  { title: 'focus', slotProps: { group: { className: controlGroup.focused } } },
  { title: 'disabled', isDisabled: true },
  { title: 'readonly', isReadOnly: true },
  { title: 'invalid', isInvalid: true, errorMessage: 'Error message' },
];

const values: InputNumberProps[] = [{}, { defaultValue: 42 }];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {inputNumberPropVariant.flatMap((variant) =>
        values.flatMap((value, index) =>
          states.map(({ title, ...state }) => (
            <InputNumber
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
