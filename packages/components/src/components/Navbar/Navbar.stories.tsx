import type { SVGProps } from 'react';

import { RouterProvider, useBoolean } from '@koobiq/react-core';
import {
  IconCloud16,
  IconDashboard16,
  IconDatabase16,
  IconPlus16,
  IconPrinter16,
  IconUser16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { DropdownMenu } from '../DropdownMenu';
import { flex, spacing } from '../layout';
import { Typography } from '../Typography';

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
    'Navbar.Action': Navbar.Action,
    'Navbar.Divider': Navbar.Divider,
  },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['status:updated', 'date:2026-09-15'],
} satisfies Meta<typeof Navbar>;

export default meta;

type Story = StoryObj<NavbarProps>;

const AppIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    {...props}
  >
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
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        blockSize: 500,
      }}
    >
      <Navbar aria-label="Main navigation" {...args}>
        <Navbar.Header>
          <Navbar.AppItem icon={<AppIcon />} href="#">
            App name
          </Navbar.AppItem>
        </Navbar.Header>

        <Navbar.Body>
          <Navbar.Item icon={<IconDatabase16 />} href="#" isActive>
            Data Catalog
          </Navbar.Item>

          <Navbar.Item icon={<IconCloud16 />} href="#">
            Integrations
          </Navbar.Item>

          <DropdownMenu>
            <Navbar.Item icon={<IconDashboard16 />} badge={12}>
              Control Panel
            </Navbar.Item>
            <DropdownMenu.Popover>
              <DropdownMenu.Content onAction={(key) => alert(key)}>
                <DropdownMenu.Item id="service-accounts">
                  Service Accounts
                </DropdownMenu.Item>
                <DropdownMenu.Item id="roles">Roles</DropdownMenu.Item>
                <DropdownMenu.SubmenuTrigger>
                  <DropdownMenu.Item id="users">Users</DropdownMenu.Item>
                  <DropdownMenu.Popover>
                    <DropdownMenu.Content onAction={(key) => alert(key)}>
                      <DropdownMenu.Item id="all-users">
                        All Users
                      </DropdownMenu.Item>
                      <DropdownMenu.Item id="invite-user">
                        Invite User
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Popover>
                </DropdownMenu.SubmenuTrigger>
              </DropdownMenu.Content>
            </DropdownMenu.Popover>
          </DropdownMenu>

          <DropdownMenu>
            <Navbar.Item icon={<IconPrinter16 />}>Documentation</Navbar.Item>
            <DropdownMenu.Popover>
              <DropdownMenu.Content onAction={(key) => alert(key)}>
                <DropdownMenu.Item id="start">
                  Getting Started
                </DropdownMenu.Item>
                <DropdownMenu.Item id="create-role">
                  How to Create a Role
                </DropdownMenu.Item>
                <DropdownMenu.Item id="add-user">
                  How to Add a User
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Popover>
          </DropdownMenu>

          <Navbar.Divider />

          <Navbar.Action
            icon={<IconPlus16 />}
            onPress={() => alert('New task')}
          >
            New task
          </Navbar.Action>
        </Navbar.Body>

        <Navbar.Footer>
          <Navbar.Item icon={<IconUser16 />} as="button" badge={2}>
            Alexander Walker
          </Navbar.Item>
        </Navbar.Footer>
      </Navbar>

      <main
        className={flex(
          { direction: 'column', gap: 'm' },
          spacing({ p: 'xl' })
        )}
      >
        <Typography variant="title">Main content</Typography>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet
          laudantium nulla voluptates! Assumenda dicta dolorem facilis iste
          itaque iure provident quisquam, quos sequi? Amet aut, consectetur
          dolor ea eaque eligendi enim eos esse excepturi fuga ipsa ipsum
          laudantium natus necessitatibus nobis officiis perferendis porro
          praesentium quibusdam quis soluta voluptas voluptatibus!
        </Typography>
      </main>
    </div>
  ),
};

export const Controlled: Story = {
  render: function Render(args) {
    const [isCollapsed, { set, toggle }] = useBoolean(false);

    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          blockSize: 500,
        }}
      >
        <Navbar {...args} isCollapsed={isCollapsed} onCollapse={set}>
          <Navbar.Header>
            <Navbar.AppItem icon={<AppIcon />} href="#">
              App name
            </Navbar.AppItem>
          </Navbar.Header>
          <Navbar.Body>
            <Navbar.Item icon={<IconDatabase16 />} href="#">
              Data Catalog
            </Navbar.Item>
            <Navbar.Item icon={<IconCloud16 />} href="#">
              Integrations
            </Navbar.Item>
          </Navbar.Body>
        </Navbar>

        <main className={spacing({ p: 'xl' })}>
          <Button onPress={toggle}>
            {isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
          </Button>
        </main>
      </div>
    );
  },
};

export const ExpandOverContent: Story = {
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'var(--kbq-size-6xl) 1fr',
        blockSize: 500,
      }}
    >
      <Navbar {...args} defaultCollapsed>
        <Navbar.Header>
          <Navbar.AppItem icon={<AppIcon />} href="#">
            App name
          </Navbar.AppItem>
        </Navbar.Header>

        <Navbar.Body>
          <Navbar.Item icon={<IconDatabase16 />} href="#" isActive>
            Data Catalog
          </Navbar.Item>

          <Navbar.Item icon={<IconCloud16 />} href="#">
            Integrations
          </Navbar.Item>
        </Navbar.Body>

        <Navbar.Footer>
          <Navbar.Item icon={<IconUser16 />} as="button" badge={2}>
            Alexander Walker
          </Navbar.Item>
        </Navbar.Footer>
      </Navbar>

      <main
        className={flex(
          { direction: 'column', gap: 'm' },
          spacing({ p: 'xl' })
        )}
      >
        <Typography variant="title">Main content</Typography>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet
          laudantium nulla voluptates! Assumenda dicta dolorem facilis iste
          itaque iure provident quisquam, quos sequi? Amet aut, consectetur
          dolor ea eaque eligendi enim eos esse excepturi fuga ipsa ipsum
          laudantium natus necessitatibus nobis officiis perferendis porro
          praesentium quibusdam quis soluta voluptas voluptatibus!
        </Typography>
      </main>
    </div>
  ),
};

export const LongAppName: Story = {
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        blockSize: 500,
      }}
    >
      <Navbar {...args}>
        <Navbar.Header>
          <Navbar.AppItem icon={<AppIcon />} href="#">
            Super Long Menu Title with Line Wrap and Ellipsis Truncation
          </Navbar.AppItem>
        </Navbar.Header>

        <Navbar.Body>
          <Navbar.Item icon={<IconDatabase16 />} href="#">
            Data Catalog of All Connected Sources
          </Navbar.Item>
        </Navbar.Body>
      </Navbar>
      <main
        className={flex(
          { direction: 'column', gap: 'm' },
          spacing({ p: 'xl' })
        )}
      >
        <Typography variant="title">Main content</Typography>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet
          laudantium nulla voluptates! Assumenda dicta dolorem facilis iste
          itaque iure provident quisquam, quos sequi? Amet aut, consectetur
          dolor ea eaque eligendi enim eos esse excepturi fuga ipsa ipsum
          laudantium natus necessitatibus nobis officiis perferendis porro
          praesentium quibusdam quis soluta voluptas voluptatibus!
        </Typography>
      </main>
    </div>
  ),
};

export const RouteProvider: Story = {
  render: (args) => (
    <RouterProvider navigate={(path) => alert(path)}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          blockSize: 500,
        }}
      >
        <Navbar {...args}>
          <Navbar.Header>
            <Navbar.AppItem icon={<AppIcon />} href="#">
              App name
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
            <Navbar.Item icon={<IconUser16 />} as="button" badge={2}>
              Alexander Walker
            </Navbar.Item>
          </Navbar.Footer>
        </Navbar>

        <main
          className={flex(
            { direction: 'column', gap: 'm' },
            spacing({ p: 'xl' })
          )}
        >
          <Typography variant="title">Main content</Typography>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eveniet
            laudantium nulla voluptates! Assumenda dicta dolorem facilis iste
            itaque iure provident quisquam, quos sequi? Amet aut, consectetur
            dolor ea eaque eligendi enim eos esse excepturi fuga ipsa ipsum
            laudantium natus necessitatibus nobis officiis perferendis porro
            praesentium quibusdam quis soluta voluptas voluptatibus!
          </Typography>
        </main>
      </div>
    </RouterProvider>
  ),
};
