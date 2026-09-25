import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import s from './components/Radio/Radio.module.css';
import {
  Radio,
  RadioGroup,
  radioGroupPropOrientation,
  radioGroupPropSize,
} from './index.js';
import type { RadioGroupProps, RadioProps } from './index.js';

const meta = {
  title: 'E2E/RadioGroup',
  component: RadioGroup,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof RadioGroup>;

type State = { title: string } & Partial<RadioProps>;

// React Aria sets hover and focus only on interaction, so their classes are forced.
const states: State[] = [
  { title: 'normal' },
  { title: 'hover', className: s.hovered },
  { title: 'focus', className: s.focusVisible },
  { title: 'disabled', isDisabled: true },
];

// Selection and validity are set on the group, not on a radio.
const groups: RadioGroupProps[] = [
  {},
  { value: 'radio' },
  { isInvalid: true },
  { isInvalid: true, value: 'radio' },
];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {radioGroupPropSize.flatMap((size) =>
        groups.flatMap((group, index) =>
          states.map(({ title, ...state }) => (
            <RadioGroup
              key={`${size}-${index}-${title}`}
              aria-label={title}
              size={size}
              {...group}
            >
              <Radio value="radio" {...state}>
                {title}
              </Radio>
            </RadioGroup>
          ))
        )
      )}
    </E2eGrid>
  ),
};

export const Orientation: Story = {
  render: () => (
    <E2eGrid columns={radioGroupPropOrientation.length}>
      {radioGroupPropOrientation.map((orientation) => (
        <RadioGroup
          key={orientation}
          label={orientation}
          orientation={orientation}
          defaultValue="one"
        >
          <Radio value="one">One</Radio>
          <Radio value="two">Two</Radio>
          <Radio value="three">Three</Radio>
        </RadioGroup>
      ))}
    </E2eGrid>
  ),
};
