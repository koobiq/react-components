import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import { Button } from '../Button';

import { TopBar } from './index.js';
import type { TopBarProps } from './index.js';

const meta = {
  title: 'E2E/TopBar',
  component: TopBar,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof TopBar>;

export default meta;

type Story = StoryObj<typeof TopBar>;

type State = { title: string } & TopBarProps;

const states: State[] = [
  { title: 'normal' },
  { title: 'shadow', hasShadow: true },
];

// The container is taller than the bar, so the screenshot includes its shadow.
export const Shadow: Story = {
  render: () => (
    <E2eGrid columns={1}>
      {states.map(({ title, ...state }) => (
        <div key={title} style={{ inlineSize: 480, blockSize: 64 }}>
          <TopBar {...state}>
            <TopBar.Container placement="start">
              <TopBar.Title>{title}</TopBar.Title>
            </TopBar.Container>
            <TopBar.Container placement="end">
              <Button variant="fade-contrast-filled">Share</Button>
              <Button>Create</Button>
            </TopBar.Container>
          </TopBar>
        </div>
      ))}
    </E2eGrid>
  ),
};
