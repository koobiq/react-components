import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';
import controlGroup from '../FormField/FormFieldControlGroup/FormFieldControlGroup.module.css';

import { TreeSelect } from './index.js';

const meta = {
  title: 'E2E/TreeSelect',
  component: TreeSelect,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof TreeSelect>;

export default meta;

type Story = StoryObj<typeof TreeSelect>;

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
  <TreeSelect.Item id={1} textValue="app" key="app">
    <TreeSelect.ItemContent>app</TreeSelect.ItemContent>
    <TreeSelect.Item id={2} textValue="index.html">
      <TreeSelect.ItemContent>index.html</TreeSelect.ItemContent>
    </TreeSelect.Item>
  </TreeSelect.Item>,
  <TreeSelect.Item id={3} textValue="main.js" key="main">
    <TreeSelect.ItemContent>main.js</TreeSelect.ItemContent>
  </TreeSelect.Item>,
];

// The value is a single key or, in multiple mode, tags: hence a row per case.
export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {states.map(({ title, ...state }) => (
        <TreeSelect
          key={`empty-${title}`}
          label={title}
          placeholder="Placeholder"
          {...state}
        >
          {items}
        </TreeSelect>
      ))}
      {states.map(({ title, ...state }) => (
        <TreeSelect
          key={`single-${title}`}
          label={title}
          placeholder="Placeholder"
          defaultValue={3}
          {...state}
        >
          {items}
        </TreeSelect>
      ))}
      {states.map(({ title, ...state }) => (
        <TreeSelect
          key={`multiple-${title}`}
          label={title}
          placeholder="Placeholder"
          selectionMode="multiple"
          defaultValue={[2, 3]}
          {...state}
        >
          {items}
        </TreeSelect>
      ))}
    </E2eGrid>
  ),
};

export const Open: Story = {
  render: () => (
    <TreeSelect
      aria-label="Project files"
      defaultOpen
      defaultValue={3}
      disabledKeys={[4]}
      defaultExpandedKeys={[1]}
      style={{ inlineSize: 200 }}
      slotProps={{ popover: { 'data-testid': 'e2eScreenshotTarget' } }}
    >
      <TreeSelect.Item id={1} textValue="app">
        <TreeSelect.ItemContent>app</TreeSelect.ItemContent>
        <TreeSelect.Item id={2} textValue="index.html">
          <TreeSelect.ItemContent>index.html</TreeSelect.ItemContent>
        </TreeSelect.Item>
        <TreeSelect.Item id={3} textValue="main.js">
          <TreeSelect.ItemContent>main.js</TreeSelect.ItemContent>
        </TreeSelect.Item>
      </TreeSelect.Item>
      <TreeSelect.Item id={4} textValue="config">
        <TreeSelect.ItemContent>config</TreeSelect.ItemContent>
        <TreeSelect.Item id={5} textValue="app.js">
          <TreeSelect.ItemContent>app.js</TreeSelect.ItemContent>
        </TreeSelect.Item>
      </TreeSelect.Item>
      <TreeSelect.Item id={6} textValue="README.md">
        <TreeSelect.ItemContent>README.md</TreeSelect.ItemContent>
      </TreeSelect.Item>
    </TreeSelect>
  ),
};
