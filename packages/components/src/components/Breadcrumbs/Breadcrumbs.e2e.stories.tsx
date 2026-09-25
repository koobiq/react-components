import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import s from './components/BreadcrumbItem/BreadcrumbItem.module.css';
import { BreadcrumbItem, Breadcrumbs, breadcrumbsPropSize } from './index.js';
import type { BreadcrumbItemProps } from './index.js';

const meta = {
  title: 'E2E/Breadcrumbs',
  component: Breadcrumbs,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;

type Story = StoryObj<typeof Breadcrumbs>;

type State = { title: string } & BreadcrumbItemProps;

// React Aria sets hover, press and focus only on interaction, so their classes are forced.
const states: State[] = [
  { title: 'normal' },
  { title: 'hover', className: s.hovered },
  { title: 'active', className: s.pressed },
  { title: 'focus', className: s.focusVisible },
  { title: 'disabled', isDisabled: true },
  { title: 'current', isCurrent: true },
];

// The default collapse mode would hide items: the grid shrinks the list it measures.
export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={1}>
      {breadcrumbsPropSize.map((size) => (
        <Breadcrumbs key={size} size={size} overflowMode="wrap">
          {states.map(({ title, ...state }) => (
            <BreadcrumbItem key={title} {...state}>
              {title}
            </BreadcrumbItem>
          ))}
        </Breadcrumbs>
      ))}
    </E2eGrid>
  ),
};
