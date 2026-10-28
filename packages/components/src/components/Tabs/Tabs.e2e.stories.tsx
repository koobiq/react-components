import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { Tab, Tabs } from './index.js';
import type { TabsProps } from './index.js';

const meta = {
  title: 'E2E/Tabs',
  component: Tabs,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof Tabs>;

type State = { title: string } & Partial<TabsProps<object>>;

// Hover and focus come from React Aria as data attributes, so only the states set by props.
const states: State[] = [
  { title: 'normal' },
  { title: 'disabled', isDisabled: true },
];

const variants: Array<Partial<TabsProps<object>>> = [
  {},
  { isUnderlined: true },
  { orientation: 'vertical' },
];

export const StateAndStyle: Story = {
  render: () => (
    <E2eGrid columns={states.length}>
      {variants.flatMap((variant, index) =>
        states.map(({ title, ...state }) => (
          <Tabs
            key={`${index}-${title}`}
            aria-label={title}
            defaultSelectedKey="selected"
            disabledKeys={['disabled']}
            {...variant}
            {...state}
          >
            <Tab key="selected">selected</Tab>
            <Tab key="normal">normal</Tab>
            <Tab key="disabled">disabled</Tab>
          </Tabs>
        ))
      )}
    </E2eGrid>
  ),
};

// The focus outline of the first tab sticks out of the list, so the screenshot needs room for it.
const focusStyle = { paddingInline: 'var(--kbq-size-m)' };

// The keyboard focus ring is drawn by React Aria, so the spec focuses the first tab with Tab.
export const FocusVisible: Story = {
  render: () => (
    <E2eGrid columns={1}>
      <div style={focusStyle}>
        <Tabs aria-label="focus" isUnderlined>
          <Tab key="first">first</Tab>
          <Tab key="second">second</Tab>
        </Tabs>
      </div>
    </E2eGrid>
  ),
};

// A list wider than its container scrolls, which clips it by the scroll box.
export const FocusVisibleScrollable: Story = {
  render: () => (
    <E2eGrid columns={1}>
      <div style={{ ...focusStyle, inlineSize: 200 }}>
        <Tabs aria-label="focus scrollable" isUnderlined>
          <Tab key="first">first</Tab>
          <Tab key="second">second</Tab>
          <Tab key="third">third</Tab>
          <Tab key="fourth">fourth</Tab>
        </Tabs>
      </div>
    </E2eGrid>
  ),
};
