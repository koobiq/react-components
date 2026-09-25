import { IconChevronDownS16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import { Button } from '../Button';
import type { ButtonProps } from '../Button';
import { Menu } from '../Menu';

import { SplitButton, splitButtonPropVariant } from './index.js';
import type { SplitButtonProps } from './index.js';

const meta = {
  title: 'E2E/SplitButton',
  component: SplitButton,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof SplitButton>;

export default meta;

type Story = StoryObj<typeof SplitButton>;

type State = {
  title: string;
  primary?: ButtonProps;
  secondary?: ButtonProps;
} & SplitButtonProps;

// The divider reacts to real hover and focus, so only the states set by props.
const states: State[] = [
  { title: 'normal' },
  { title: 'disabled', isDisabled: true },
  { title: 'primary disabled', primary: { isDisabled: true } },
  { title: 'secondary disabled', secondary: { isDisabled: true } },
  { title: 'progress', isLoading: true },
];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {splitButtonPropVariant.flatMap((variant) =>
        states.map(({ title, primary, secondary, ...state }) => (
          <SplitButton key={`${variant}-${title}`} variant={variant} {...state}>
            <Button {...primary}>{title}</Button>
            <Menu
              control={(props) => (
                <Button
                  {...props}
                  aria-label="More"
                  startIcon={<IconChevronDownS16 />}
                  onlyIcon
                  {...secondary}
                />
              )}
            >
              <Menu.Item key="item">Item</Menu.Item>
            </Menu>
          </SplitButton>
        ))
      )}
    </E2eGrid>
  ),
};
