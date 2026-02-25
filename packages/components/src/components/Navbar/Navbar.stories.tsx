import { RouterProvider } from '@koobiq/react-core';
import {
  IconCloud16,
  IconDashboard16,
  IconDatabase16,
  IconPrinter16,
  IconUser16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Menu } from '../Menu';

import { Navbar, type NavbarProps } from '.';

const meta = {
  title: 'Components/Navbar',
  component: Navbar,
  subcomponents: {
    'Navbar.Header': Navbar.Header,
    'Navbar.Body': Navbar.Body,
    'Navbar.Footer': Navbar.Footer,
    'Navbar.Item': Navbar.Item,
    'Navbar.AppItem': Navbar.AppItem,
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['status:new', 'date:2026-02-11'],
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'grid',
          inlineSize: 'calc(100% - 2rem)',
          gridTemplateColumns: 'auto auto',
          gridTemplateRows: 'calc(100dvh - 2rem)',
        }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Navbar>;

export default meta;

type Story = StoryObj<NavbarProps>;

const appIcon = (
  <svg width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 25.6C0 28.4 0 30 1 31s2.6 1 5.4 1h19.2c2.8 0 4.4 0 5.4-1s1-2.6 1-5.4V6.4C32 3.6 32 2 31 1s-2.6-1-5.4-1H6.4C3.6 0 2 0 1 1S0 3.6 0 6.4v19.2Z"
      fill="red"
    />
    <path
      d="m15 16-3.8 3.8L7.4 16l3.8-3.7L15 16Zm4.8 4.9L16 24.6l-3.8-3.7L16 17l3.7 3.8Zm0-9.7L16 14.9l-3.8-3.7L16 7.4l3.7 3.8Zm4.8 4.8-3.7 3.8L17 16l3.8-3.7 3.7 3.7Z"
      fill="#fff"
    />
  </svg>
);

export const Base: Story = {
  render: (args) => (
    <Navbar {...args}>
      <Navbar.Header>
        <Navbar.AppItem icon={appIcon} href="#">
          Product name
        </Navbar.AppItem>
      </Navbar.Header>

      <Navbar.Body>
        <Navbar.Item icon={<IconDatabase16 />} href="#">
          Data Catalog
        </Navbar.Item>

        <Navbar.Item icon={<IconCloud16 />} href="#">
          Integrations
        </Navbar.Item>

        <Menu
          placement="end top"
          items={[
            { id: 'sa', name: 'Service Accounts' },
            { id: 'roles', name: 'Roles' },
            { id: 'users', name: 'Users' },
          ]}
          onAction={(key) => alert(key)}
          control={(props) => (
            <Navbar.Item {...props} icon={<IconDashboard16 />} badge={2} isMenu>
              Control Panel
            </Navbar.Item>
          )}
        >
          {(item) => <Menu.Item key={item.id}>{item.name}</Menu.Item>}
        </Menu>

        <Menu
          placement="end top"
          items={[
            { id: 'start', name: 'Getting Started' },
            { id: 'roles', name: 'How to Create a Role' },
            { id: 'users', name: 'How to Add a User' },
          ]}
          onAction={(key) => alert(key)}
          control={(props) => (
            <Navbar.Item {...props} icon={<IconPrinter16 />} isMenu>
              Documentation
            </Navbar.Item>
          )}
        >
          {(item) => <Menu.Item key={item.id}>{item.name}</Menu.Item>}
        </Menu>
      </Navbar.Body>

      <Navbar.Footer>
        <Navbar.Item icon={<IconUser16 />} as="button" badge={2}>
          Alexander Konstantinopolous
        </Navbar.Item>
      </Navbar.Footer>
    </Navbar>
  ),
};

export const RouteProvider: Story = {
  render: (args) => (
    <RouterProvider navigate={(path) => alert(path)}>
      <Navbar {...args}>
        <Navbar.Header>
          <Navbar.AppItem icon={appIcon} href="#">
            Product name
          </Navbar.AppItem>
        </Navbar.Header>

        <Navbar.Body>
          <Navbar.Item icon={<IconDatabase16 />} href="/link-1">
            Link 1
          </Navbar.Item>

          <Navbar.Item icon={<IconDatabase16 />} href="/link-2">
            Link 2
          </Navbar.Item>

          <Navbar.Item icon={<IconDatabase16 />} href="/link-3">
            Link 3
          </Navbar.Item>
        </Navbar.Body>

        <Navbar.Footer>
          <Navbar.Item icon={<IconUser16 />} as={'button'} badge={2}>
            Alexander Konstantinopolous
          </Navbar.Item>
        </Navbar.Footer>
      </Navbar>
    </RouterProvider>
  ),
};
