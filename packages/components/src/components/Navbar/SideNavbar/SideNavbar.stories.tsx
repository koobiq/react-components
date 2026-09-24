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

import { Button } from '../../Button';
import { DropdownMenu } from '../../DropdownMenu';
import { flex, spacing } from '../../layout';
import { Typography } from '../../Typography';

import { SideNavbar, type SideNavbarProps } from '.';

const meta = {
  title: 'Components/Navbar/SideNavbar',
  component: SideNavbar,
  subcomponents: {
    'SideNavbar.Header': SideNavbar.Header,
    'SideNavbar.Body': SideNavbar.Body,
    'SideNavbar.Footer': SideNavbar.Footer,
    'SideNavbar.Item': SideNavbar.Item,
    'SideNavbar.AppItem': SideNavbar.AppItem,
    'SideNavbar.Action': SideNavbar.Action,
    'SideNavbar.Divider': SideNavbar.Divider,
  },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['status:new', 'date:2026-09-15'],
} satisfies Meta<typeof SideNavbar>;

export default meta;

type Story = StoryObj<SideNavbarProps>;

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
        display: 'flex',
        blockSize: 500,
      }}
    >
      <SideNavbar aria-label="Main navigation" {...args}>
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

          <DropdownMenu>
            <SideNavbar.Item icon={<IconDashboard16 />} badge={12}>
              Control Panel
            </SideNavbar.Item>
            <DropdownMenu.Popover>
              <DropdownMenu.Content>
                <DropdownMenu.Item href="#service-accounts">
                  Service Accounts
                </DropdownMenu.Item>
                <DropdownMenu.Item href="#roles">Roles</DropdownMenu.Item>
                <DropdownMenu.SubmenuTrigger>
                  <DropdownMenu.Item id="users">Users</DropdownMenu.Item>
                  <DropdownMenu.Popover>
                    <DropdownMenu.Content onAction={(key) => alert(key)}>
                      <DropdownMenu.Item href="#users">
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
            <SideNavbar.Item icon={<IconPrinter16 />}>
              Documentation
            </SideNavbar.Item>
            <DropdownMenu.Popover>
              <DropdownMenu.Content>
                <DropdownMenu.Item href="#getting-started">
                  Getting Started
                </DropdownMenu.Item>
                <DropdownMenu.Item href="#create-role">
                  How to Create a Role
                </DropdownMenu.Item>
                <DropdownMenu.Item href="#add-user">
                  How to Add a User
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Popover>
          </DropdownMenu>

          <SideNavbar.Divider />

          <SideNavbar.Action
            icon={<IconPlus16 />}
            onPress={() => alert('New task')}
          >
            New task
          </SideNavbar.Action>
        </SideNavbar.Body>

        <SideNavbar.Footer>
          <SideNavbar.Item icon={<IconUser16 />} as="button" badge={2}>
            Alexander Walker
          </SideNavbar.Item>
        </SideNavbar.Footer>
      </SideNavbar>

      <main
        className={flex(
          { direction: 'column', gap: 'm' },
          spacing({ p: 'xl' })
        )}
        style={{ flex: '1 1 auto', minInlineSize: 0 }}
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
          display: 'flex',
          blockSize: 500,
        }}
      >
        <SideNavbar {...args} isCollapsed={isCollapsed} onCollapse={set}>
          <SideNavbar.Header>
            <SideNavbar.AppItem icon={<AppIcon />} href="#">
              App name
            </SideNavbar.AppItem>
          </SideNavbar.Header>
          <SideNavbar.Body>
            <SideNavbar.Item icon={<IconDatabase16 />} href="#">
              Data Catalog
            </SideNavbar.Item>
            <SideNavbar.Item icon={<IconCloud16 />} href="#">
              Integrations
            </SideNavbar.Item>
          </SideNavbar.Body>
        </SideNavbar>

        <main
          className={spacing({ p: 'xl' })}
          style={{ flex: '1 1 auto', minInlineSize: 0 }}
        >
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
        display: 'flex',
        blockSize: 500,
      }}
    >
      <div style={{ flex: '0 0 var(--kbq-size-6xl)', minInlineSize: 0 }}>
        <SideNavbar {...args} defaultCollapsed>
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

          <SideNavbar.Footer>
            <SideNavbar.Item icon={<IconUser16 />} as="button" badge={2}>
              Alexander Walker
            </SideNavbar.Item>
          </SideNavbar.Footer>
        </SideNavbar>
      </div>

      <main
        className={flex(
          { direction: 'column', gap: 'm' },
          spacing({ p: 'xl' })
        )}
        style={{ flex: '1 1 auto', minInlineSize: 0 }}
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
        display: 'flex',
        blockSize: 500,
      }}
    >
      <SideNavbar {...args}>
        <SideNavbar.Header>
          <SideNavbar.AppItem icon={<AppIcon />} href="#">
            Super Long Menu Title with Line Wrap and Ellipsis Truncation
          </SideNavbar.AppItem>
        </SideNavbar.Header>

        <SideNavbar.Body>
          <SideNavbar.Item icon={<IconDatabase16 />} href="#">
            Data Catalog of All Connected Sources
          </SideNavbar.Item>
        </SideNavbar.Body>
      </SideNavbar>
      <main
        className={flex(
          { direction: 'column', gap: 'm' },
          spacing({ p: 'xl' })
        )}
        style={{ flex: '1 1 auto', minInlineSize: 0 }}
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
          display: 'flex',
          blockSize: 500,
        }}
      >
        <SideNavbar {...args}>
          <SideNavbar.Header>
            <SideNavbar.AppItem icon={<AppIcon />} href="#">
              App name
            </SideNavbar.AppItem>
          </SideNavbar.Header>

          <SideNavbar.Body>
            <SideNavbar.Item icon={<IconDatabase16 />} href="/link-1">
              Link 1
            </SideNavbar.Item>

            <SideNavbar.Item icon={<IconDatabase16 />} href="/link-2">
              Link 2
            </SideNavbar.Item>

            <SideNavbar.Item icon={<IconDatabase16 />} href="/link-3">
              Link 3
            </SideNavbar.Item>

            <DropdownMenu>
              <SideNavbar.Item icon={<IconDatabase16 />}>
                More links
              </SideNavbar.Item>
              <DropdownMenu.Popover>
                <DropdownMenu.Content>
                  <DropdownMenu.Item href="/link-4">Link 4</DropdownMenu.Item>
                  <DropdownMenu.Item href="/link-5">Link 5</DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Popover>
            </DropdownMenu>
          </SideNavbar.Body>

          <SideNavbar.Footer>
            <SideNavbar.Item icon={<IconUser16 />} as="button" badge={2}>
              Alexander Walker
            </SideNavbar.Item>
          </SideNavbar.Footer>
        </SideNavbar>

        <main
          className={flex(
            { direction: 'column', gap: 'm' },
            spacing({ p: 'xl' })
          )}
          style={{ flex: '1 1 auto', minInlineSize: 0 }}
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
