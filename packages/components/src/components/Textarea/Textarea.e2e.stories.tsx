import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { Textarea, textareaPropVariant } from './index.js';
import type { TextareaProps } from './index.js';

const meta = {
  title: 'E2E/Textarea',
  component: Textarea,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof Textarea>;

type State = { title: string } & TextareaProps;

// Focus comes from React Aria, so only the states set by props.
const states: State[] = [
  { title: 'normal' },
  { title: 'disabled', isDisabled: true },
  { title: 'readonly', isReadOnly: true },
  { title: 'invalid', isInvalid: true, errorMessage: 'Error message' },
];

const values: TextareaProps[] = [{}, { defaultValue: 'Value' }];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {textareaPropVariant.flatMap((variant) =>
        values.flatMap((value, index) =>
          states.map(({ title, ...state }) => (
            <Textarea
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
