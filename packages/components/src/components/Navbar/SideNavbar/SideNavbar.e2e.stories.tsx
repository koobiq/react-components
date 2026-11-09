import type { CSSProperties, SVGProps } from 'react';

import { IconCloud16, IconDatabase16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { E2eGrid } from '../../../../e2e/E2eGrid';

import { SideNavbar } from './index.js';

const meta = {
  title: 'E2E/SideNavbar',
  component: SideNavbar,
  tags: ['!dev', '!manifest'],
} satisfies Meta<typeof SideNavbar>;

export default meta;

type Story = StoryObj<typeof SideNavbar>;

const AppIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    {...props}
  >
    <rect width="32" height="32" rx="16" fill="#f24d3d" />
  </svg>
);

const layoutStyle = {
  display: 'flex',
  blockSize: 360,
  inlineSize: 420,
  border: '1px solid var(--kbq-line-contrast-less)',
} as CSSProperties;

const contentStyle = {
  flex: '1 1 auto',
  minInlineSize: 0,
} as CSSProperties;

const navbar = (isCollapsed: boolean) => (
  <div key={String(isCollapsed)} style={layoutStyle}>
    <SideNavbar aria-label="Main navigation" isCollapsed={isCollapsed}>
      <SideNavbar.Header>
        <SideNavbar.AppItem icon={<AppIcon />} href="#">
          App name
        </SideNavbar.AppItem>
      </SideNavbar.Header>

      <SideNavbar.Body>
        <SideNavbar.Item icon={<IconDatabase16 />} href="#" isActive>
          Data Catalog
        </SideNavbar.Item>

        <SideNavbar.Item icon={<IconCloud16 />} href="#">
          Integrations
        </SideNavbar.Item>
      </SideNavbar.Body>
    </SideNavbar>

    <div style={contentStyle}>content</div>
  </div>
);

export const State: Story = {
  render: () => (
    <E2eGrid columns={2}>
      {[false, true].map((isCollapsed) => navbar(isCollapsed))}
    </E2eGrid>
  ),
};
