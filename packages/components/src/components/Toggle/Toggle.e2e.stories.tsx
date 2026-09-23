import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { Toggle, togglePropSize } from './index.js';
import type { ToggleProps } from './index.js';
import s from './Toggle.module.css';

const meta = {
  title: 'E2E/Toggle',
  component: Toggle,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof Toggle>;

type State = { title: string } & ToggleProps;

// React Aria sets hover and focus only on interaction, so their classes are forced.
const states: State[] = [
  { title: 'normal' },
  { title: 'hover', className: s.hovered },
  { title: 'focus', className: s.focusVisible },
  { title: 'disabled', isDisabled: true },
  { title: 'invalid', isInvalid: true },
  { title: 'progress', isLoading: true },
];

const values: ToggleProps[] = [{}, { isSelected: true }];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {togglePropSize.flatMap((size) =>
        values.flatMap((value, index) =>
          states.map(({ title, ...state }) => (
            <Toggle
              key={`${size}-${index}-${title}`}
              size={size}
              {...value}
              {...state}
            >
              {title}
            </Toggle>
          ))
        )
      )}
    </E2eGrid>
  ),
};
