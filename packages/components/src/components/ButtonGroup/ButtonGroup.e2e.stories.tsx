import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import { Button } from '../Button';

import {
  ButtonGroup,
  buttonGroupPropOrientation,
  buttonGroupPropVariant,
} from './index.js';
import type { ButtonGroupProps } from './index.js';

const meta = {
  title: 'E2E/ButtonGroup',
  component: ButtonGroup,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof ButtonGroup>;

export default meta;

type Story = StoryObj<typeof ButtonGroup>;

type State = { title: string } & ButtonGroupProps;

// Hover, press and focus belong to the buttons, so only the states of the group.
const states: State[] = [
  { title: 'normal' },
  { title: 'disabled', isDisabled: true },
  { title: 'progress', isLoading: true },
];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {buttonGroupPropOrientation.flatMap((orientation) =>
        buttonGroupPropVariant.flatMap((variant) =>
          states.map(({ title, ...state }) => (
            <ButtonGroup
              key={`${orientation}-${variant}-${title}`}
              orientation={orientation}
              variant={variant}
              {...state}
            >
              <Button>{title}</Button>
              <Button>{title}</Button>
            </ButtonGroup>
          ))
        )
      )}
    </E2eGrid>
  ),
};
