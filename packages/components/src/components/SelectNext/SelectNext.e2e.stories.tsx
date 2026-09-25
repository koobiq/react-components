import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import controlGroup from '../FormField/FormFieldControlGroup/FormFieldControlGroup.module.css';

import { SelectNext } from './index.js';

const meta = {
  title: 'E2E/SelectNext',
  component: SelectNext,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof SelectNext>;

export default meta;

type Story = StoryObj<typeof SelectNext>;

// Spelled out rather than taken from the props: those are generic over the
// selection mode, and spreading them would pin every row to a single mode.
type State = {
  title: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  isInvalid?: boolean;
  errorMessage?: string;
  slotProps?: { group?: { className?: string } };
};

// React Aria sets focus only on interaction, so the control group's class is forced.
const states: State[] = [
  { title: 'normal' },
  { title: 'focus', slotProps: { group: { className: controlGroup.focused } } },
  { title: 'disabled', isDisabled: true },
  { title: 'readonly', isReadOnly: true },
  { title: 'invalid', isInvalid: true, errorMessage: 'Error message' },
];

const items = [
  <SelectNext.Item id="ddos" key="ddos">
    DDoS
  </SelectNext.Item>,
  <SelectNext.Item id="dos" key="dos">
    DoS
  </SelectNext.Item>,
];

// The value is a single key or, in multiple mode, tags: hence a row per case.
export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {states.map(({ title, ...state }) => (
        <SelectNext
          key={`empty-${title}`}
          label={title}
          placeholder="Placeholder"
          {...state}
        >
          {items}
        </SelectNext>
      ))}
      {states.map(({ title, ...state }) => (
        <SelectNext
          key={`single-${title}`}
          label={title}
          placeholder="Placeholder"
          defaultValue="ddos"
          {...state}
        >
          {items}
        </SelectNext>
      ))}
      {states.map(({ title, ...state }) => (
        <SelectNext
          key={`multiple-${title}`}
          label={title}
          placeholder="Placeholder"
          selectionMode="multiple"
          defaultValue={['ddos', 'dos']}
          {...state}
        >
          {items}
        </SelectNext>
      ))}
    </E2eGrid>
  ),
};

// The open list is screenshotted by itself, so the test id goes on the popover.
export const Open: Story = {
  render: () => (
    <SelectNext
      aria-label="Attack type"
      defaultOpen
      defaultValue="ddos"
      disabledKeys={['dos']}
      style={{ inlineSize: 200 }}
      slotProps={{ popover: { 'data-testid': 'e2eScreenshotTarget' } }}
    >
      <SelectNext.Item id="bruteforce">Bruteforce</SelectNext.Item>
      <SelectNext.Item id="complex-attack">Complex Attack</SelectNext.Item>
      <SelectNext.Item id="ddos">DDoS</SelectNext.Item>
      <SelectNext.Item id="dos">DoS</SelectNext.Item>
    </SelectNext>
  ),
};
