import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { SearchExpandable } from './index';
import type { SearchExpandableProps } from './index';

const meta = {
  title: 'E2E/SearchExpandable',
  component: SearchExpandable,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof SearchExpandable>;

export default meta;

type Story = StoryObj<typeof SearchExpandable>;

type State = { title: string } & SearchExpandableProps;

const states: State[] = [
  { title: 'collapsed' },
  { title: 'expanded', defaultOpen: true },
  { title: 'expanded with value', defaultOpen: true, defaultValue: 'Value' },
  { title: 'disabled collapsed', isDisabled: true },
  { title: 'disabled expanded', defaultOpen: true, isDisabled: true },
];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {states.map(({ title, ...state }) => (
        <SearchExpandable key={title} {...state} />
      ))}
    </E2eGrid>
  ),
};
