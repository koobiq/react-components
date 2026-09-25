import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import s from './Checkbox.module.css';
import { Checkbox, checkboxPropSize } from './index.js';
import type { CheckboxProps } from './index.js';

const meta = {
  title: 'E2E/Checkbox',
  component: Checkbox,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof Checkbox>;

type State = { title: string } & CheckboxProps;

// React Aria sets hover and focus only on interaction, so their classes are forced.
const states: State[] = [
  { title: 'normal' },
  { title: 'hover', className: s.hovered },
  { title: 'focus', className: s.focusVisible },
  { title: 'disabled', isDisabled: true },
  { title: 'invalid', isInvalid: true },
];

const values: CheckboxProps[] = [
  {},
  { isSelected: true },
  { isIndeterminate: true },
];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {checkboxPropSize.flatMap((size) =>
        values.flatMap((value, index) =>
          states.map(({ title, ...state }) => (
            <Checkbox
              key={`${size}-${index}-${title}`}
              size={size}
              {...value}
              {...state}
            >
              {title}
            </Checkbox>
          ))
        )
      )}
    </E2eGrid>
  ),
};
