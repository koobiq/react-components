import { IconChevronDownS16, IconPlay16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import s from './Button.module.css';
import { Button, buttonPropVariant } from './index.js';
import type { ButtonProps } from './index.js';

const meta = {
  title: 'E2E/Button',
  component: Button,
  // Hidden from the sidebar and llms.txt, but still served by URL.
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof Button>;

type State = { title: string } & ButtonProps;

// React Aria sets hover, press and focus only on interaction, so their classes are forced.
const states: State[] = [
  { title: 'disabled', isDisabled: true },
  { title: 'normal' },
  { title: 'hover', className: s.hovered },
  { title: 'active', className: s.pressed },
  { title: 'focus', className: s.focusVisible },
  { title: 'progress', isLoading: true },
];

type StateAndStyleGridProps = Pick<ButtonProps, 'startIcon' | 'endIcon'> & {
  hideTitle?: boolean;
};

const StateAndStyleGrid = ({
  startIcon,
  endIcon,
  hideTitle,
}: StateAndStyleGridProps) => (
  <E2eGrid columns={states.length}>
    {buttonPropVariant.flatMap((variant) =>
      states.map(({ title, ...state }) => (
        <Button
          key={`${variant}-${title}`}
          variant={variant}
          startIcon={startIcon}
          endIcon={endIcon}
          aria-label={hideTitle ? title : undefined}
          {...state}
        >
          {!hideTitle && title}
        </Button>
      ))
    )}
  </E2eGrid>
);

export const StateAndStyle: Story = {
  render: () => <StateAndStyleGrid />,
};

export const StateAndStyleIconOnly: Story = {
  render: () => <StateAndStyleGrid startIcon={<IconPlay16 />} hideTitle />,
};

export const StateAndStyleWithIcons: Story = {
  render: () => (
    <StateAndStyleGrid
      startIcon={<IconPlay16 />}
      endIcon={<IconChevronDownS16 />}
    />
  ),
};
