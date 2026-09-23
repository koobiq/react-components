import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import { Checkbox } from '../Checkbox';

import { CheckboxGroup, checkboxGroupPropOrientation } from './index.js';
import type { CheckboxGroupProps } from './index.js';

const meta = {
  title: 'E2E/CheckboxGroup',
  component: CheckboxGroup,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof CheckboxGroup>;

export default meta;

type Story = StoryObj<typeof CheckboxGroup>;

type State = { title: string } & CheckboxGroupProps;

// The checkbox states have their own test, so only the states of the group.
const states: State[] = [
  { title: 'normal' },
  { title: 'disabled', isDisabled: true },
  { title: 'invalid', isInvalid: true },
];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {checkboxGroupPropOrientation.flatMap((orientation) =>
        states.map(({ title, ...state }) => (
          <CheckboxGroup
            key={`${orientation}-${title}`}
            label={title}
            orientation={orientation}
            defaultValue={['one']}
            {...state}
          >
            <Checkbox value="one">One</Checkbox>
            <Checkbox value="two">Two</Checkbox>
          </CheckboxGroup>
        ))
      )}
    </E2eGrid>
  ),
};
