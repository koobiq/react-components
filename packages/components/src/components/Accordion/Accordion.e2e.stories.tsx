import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { accordionSummaryPropExpandIconPlacement } from './components/index.js';
import { Accordion } from './index.js';
import type { AccordionProps } from './index.js';

const meta = {
  title: 'E2E/Accordion',
  component: Accordion,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj<typeof Accordion>;

type State = { title: string } & AccordionProps;

// Hover and focus cannot be forced with a class here, so only the states set by props.
const states: State[] = [
  { title: 'collapsed' },
  { title: 'expanded', isExpanded: true },
  { title: 'disabled', isDisabled: true },
];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {accordionSummaryPropExpandIconPlacement.flatMap((placement) =>
        states.map(({ title, ...state }) => (
          <Accordion
            key={`${placement}-${title}`}
            style={{ inlineSize: 200 }}
            {...state}
          >
            <Accordion.Summary expandIconPlacement={placement}>
              {title}
            </Accordion.Summary>
            <Accordion.Details>Details</Accordion.Details>
          </Accordion>
        ))
      )}
    </E2eGrid>
  ),
};
