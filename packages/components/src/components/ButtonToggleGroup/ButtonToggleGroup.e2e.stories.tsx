import { IconPlus16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import s from './components/ButtonToggle/ButtonToggle.module.css';
import { ButtonToggle, ButtonToggleGroup } from './index.js';
import type { ButtonToggleGroupProps, ButtonToggleProps } from './index.js';

const meta = {
  title: 'E2E/ButtonToggleGroup',
  component: ButtonToggleGroup,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof ButtonToggleGroup>;

export default meta;

type Story = StoryObj<typeof ButtonToggleGroup>;

type State = { title: string } & Pick<
  ButtonToggleProps,
  'className' | 'isDisabled'
>;

// React Aria sets hover, press and focus only on interaction, so their classes are forced.
const states: State[] = [
  { title: 'normal' },
  { title: 'hover', className: s.hovered },
  { title: 'active', className: s.pressed },
  { title: 'focus', className: s.focusVisible },
  { title: 'disabled', isDisabled: true },
];

const values: ButtonToggleGroupProps[] = [{}, { selectedKey: 'toggle' }];

// The group types its children as an array, even for a single item.
export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {values.flatMap((value, index) =>
        states.map(({ title, ...state }) => (
          <ButtonToggleGroup key={`${index}-${title}`} {...value}>
            {[
              <ButtonToggle
                key="toggle"
                id="toggle"
                icon={<IconPlus16 />}
                {...state}
              >
                {title}
              </ButtonToggle>,
            ]}
          </ButtonToggleGroup>
        ))
      )}
    </E2eGrid>
  ),
};
