import type { CSSProperties } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../e2e/E2eGrid';

import { Sidebar } from './index.js';
import type { SidebarRenderProps } from './index.js';

const meta = {
  title: 'E2E/Sidebar',
  component: Sidebar,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof Sidebar>;

const layoutStyle = {
  display: 'flex',
  blockSize: 80,
  inlineSize: 640,
  border: '1px solid var(--kbq-line-contrast-less)',
} as CSSProperties;

// Sidebar has no background of its own, so one shows its size.
const sidebarStyle = {
  flex: 'none',
  alignItems: 'center',
  backgroundColor: 'var(--kbq-background-bg-tertiary)',
} as CSSProperties;

const contentStyle = {
  display: 'flex',
  flex: '1 1 auto',
  alignItems: 'center',
  justifyContent: 'center',
  minInlineSize: 0,
} as CSSProperties;

const label = ({ isOpen }: SidebarRenderProps) => (isOpen ? 'sidebar' : 's');

export const State: Story = {
  render: () => (
    <E2eGrid columns={1}>
      {[true, false].map((isOpen) => (
        <div key={String(isOpen)} style={layoutStyle}>
          <Sidebar isOpen={isOpen} style={sidebarStyle}>
            {label}
          </Sidebar>
          <div style={contentStyle}>content</div>
          <Sidebar isOpen={isOpen} placement="end" style={sidebarStyle}>
            {label}
          </Sidebar>
        </div>
      ))}
    </E2eGrid>
  ),
};
