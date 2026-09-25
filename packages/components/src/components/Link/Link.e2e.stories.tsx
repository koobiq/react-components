import { IconPlus16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { Link } from './index.js';
import type { LinkProps } from './index.js';
import s from './Link.module.css';

const meta = {
  title: 'E2E/Link',
  component: Link,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Link>;

export default meta;

type Story = StoryObj<typeof Link>;

type State = { title: string } & LinkProps;

// React Aria sets hover, press and focus only on interaction, so their classes are forced.
const states: State[] = [
  { title: 'normal' },
  { title: 'hover', className: s.hovered },
  { title: 'active', className: s.pressed },
  { title: 'focus', className: s.focusVisible },
  { title: 'disabled', isDisabled: true },
];

const styles: LinkProps[] = [
  { variant: 'text-compact' },
  { variant: 'text-normal' },
  { variant: 'text-big' },
  { isPseudo: true },
  { startIcon: <IconPlus16 /> },
];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {styles.flatMap((style, index) =>
        states.map(({ title, ...state }) => (
          <Link key={`${index}-${title}`} href="#" {...style} {...state}>
            {title}
          </Link>
        ))
      )}
    </E2eGrid>
  ),
};
