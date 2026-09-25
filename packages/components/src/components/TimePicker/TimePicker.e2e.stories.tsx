import { Time } from '@internationalized/date';
import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import { dateInputPropVariant } from '../DateInput';
import controlGroup from '../FormField/FormFieldControlGroup/FormFieldControlGroup.module.css';

import { TimePicker } from './index.js';
import type { TimePickerProps } from './index.js';

const meta = {
  title: 'E2E/TimePicker',
  component: TimePicker,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof TimePicker>;

export default meta;

type Story = StoryObj<typeof TimePicker>;

type State = { title: string } & TimePickerProps<Time>;

// React Aria sets focus only on interaction, so the control group's class is forced.
const states: State[] = [
  { title: 'normal' },
  { title: 'focus', slotProps: { group: { className: controlGroup.focused } } },
  { title: 'disabled', isDisabled: true },
  { title: 'readonly', isReadOnly: true },
  { title: 'invalid', isInvalid: true, errorMessage: 'Error message' },
];

const values: TimePickerProps<Time>[] = [
  {},
  { defaultValue: new Time(10, 30) },
];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {dateInputPropVariant.flatMap((variant) =>
        values.flatMap((value, index) =>
          states.map(({ title, ...state }) => (
            <TimePicker
              key={`${variant}-${index}-${title}`}
              label={title}
              variant={variant}
              {...value}
              {...state}
            />
          ))
        )
      )}
    </E2eGrid>
  ),
};
