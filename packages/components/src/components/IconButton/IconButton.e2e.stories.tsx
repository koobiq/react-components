import { IconPlus16, IconPlus24 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import s from './IconButton.module.css';
import { IconButton, iconButtonPropVariant } from './index.js';
import type { IconButtonProps } from './index.js';

const meta = {
  title: 'E2E/IconButton',
  component: IconButton,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof IconButton>;

type State = { title: string } & IconButtonProps;

// React Aria sets hover, press and focus only on interaction, so their classes are forced.
const states: State[] = [
  { title: 'normal' },
  { title: 'hover', className: s.hovered },
  { title: 'active', className: s.pressed },
  { title: 'focus', className: s.focusVisible },
  { title: 'disabled', isDisabled: true },
];

// Sizes change only the geometry, so they get a row each in the default variant.
const styles: IconButtonProps[] = [
  ...iconButtonPropVariant.map((variant) => ({ variant })),
  { size: 'l' },
  { size: 'l', isCompact: true },
];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {styles.flatMap((style, index) =>
        states.map(({ title, ...state }) => (
          <IconButton
            key={`${index}-${title}`}
            aria-label={title}
            {...style}
            {...state}
          >
            {style.size === 'l' ? <IconPlus16 /> : <IconPlus24 />}
          </IconButton>
        ))
      )}
    </E2eGrid>
  ),
};
