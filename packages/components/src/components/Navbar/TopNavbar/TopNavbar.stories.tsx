import type { SVGProps } from 'react';

import { RouterProvider } from '@koobiq/react-core';
import {
  IconBell16,
  IconFolder16,
  IconGear16,
  IconMagnifyingGlass16,
  IconPlus16,
  IconUser16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { DropdownMenu } from '../../DropdownMenu';
import { flex, spacing } from '../../layout';
import { Typography } from '../../Typography';

import { TopNavbar, type TopNavbarProps } from '.';

const meta = {
  title: 'Components/Navbar/TopNavbar',
  component: TopNavbar,
  subcomponents: {
    'TopNavbar.Container': TopNavbar.Container,
    'TopNavbar.Item': TopNavbar.Item,
    'TopNavbar.AppItem': TopNavbar.AppItem,
    'TopNavbar.Action': TopNavbar.Action,
    'TopNavbar.Divider': TopNavbar.Divider,
  },
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['status:new', 'date:2026-09-16'],
} satisfies Meta<typeof TopNavbar>;

export default meta;

type Story = StoryObj<TopNavbarProps>;

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
      d="M0 6.4C0 1.6 1.6 0 6.4 0h19.2C30.4 0 32 1.6 32 6.4v19.2c0 4.8-1.6 6.4-6.4 6.4H6.4C1.6 32 0 30.4 0 25.6V6.4Z"
      fill="red"
    />
    <path
      d="m15 16-3.8 3.8L7.4 16l3.8-3.7L15 16Zm4.8 4.9L16 24.6l-3.8-3.7L16 17l3.7 3.8Zm0-9.7L16 14.9l-3.8-3.7L16 7.4l3.7 3.8Zm4.8 4.8-3.7 3.8L17 16l3.8-3.7 3.7 3.7Z"
      fill="#fff"
    />
  </svg>
);

export const Base: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        blockSize: 500,
      }}
    >
      <TopNavbar aria-label="Main navigation">
        <TopNavbar.Container placement="start">
          <TopNavbar.AppItem icon={<AppIcon />} href="#">
            App name
          </TopNavbar.AppItem>
          <TopNavbar.Item
            icon={<IconFolder16 />}
            href="#"
            aria-label="Projects"
          />
          <TopNavbar.Item href="#" isActive>
            Tasks
          </TopNavbar.Item>
          <DropdownMenu>
            <TopNavbar.Item>Projects</TopNavbar.Item>
            <DropdownMenu.Popover>
              <DropdownMenu.Content onAction={(key) => alert(key)}>
                <DropdownMenu.Item id="roles">Roles</DropdownMenu.Item>
                <DropdownMenu.Item id="users">Users</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Popover>
          </DropdownMenu>
          <TopNavbar.Action icon={<IconPlus16 />}>New task</TopNavbar.Action>
        </TopNavbar.Container>

        <TopNavbar.Container placement="end">
          <TopNavbar.Item
            icon={<IconBell16 />}
            as="button"
            badge={5}
            aria-label="Notifications"
          />
          <TopNavbar.Item
            icon={<IconGear16 />}
            as="button"
            aria-label="Settings"
          />
          <TopNavbar.Divider />
          <TopNavbar.Item
            icon={<IconMagnifyingGlass16 />}
            as="button"
            aria-label="Search"
          />
          <TopNavbar.Item
            icon={<IconUser16 />}
            as="button"
            aria-label="Profile"
          />
        </TopNavbar.Container>
      </TopNavbar>

      <main
        className={flex({ direction: 'column', gap: 'm' }, spacing({ p: 'm' }))}
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
  render: () => (
    <RouterProvider navigate={(path) => alert(path)}>
      <div
        style={{
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          blockSize: 500,
        }}
      >
        <TopNavbar aria-label="Main navigation">
          <TopNavbar.Container placement="start">
            <TopNavbar.AppItem icon={<AppIcon />} href="/home">
              App name
            </TopNavbar.AppItem>
            <TopNavbar.Item icon={<IconFolder16 />} href="/integrations">
              Integrations
            </TopNavbar.Item>
          </TopNavbar.Container>
        </TopNavbar>

        <main
          className={flex(
            { direction: 'column', gap: 'm' },
            spacing({ p: 'm' })
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
