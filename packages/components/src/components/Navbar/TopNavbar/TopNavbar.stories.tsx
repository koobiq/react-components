import { useEffect, useState } from 'react';
import type { CSSProperties, SVGProps } from 'react';

import { RouterProvider, useHideOverflowItems } from '@koobiq/react-core';
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
        display: 'flex',
        flexDirection: 'column',
        blockSize: 240,
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
              <DropdownMenu.Content>
                <DropdownMenu.Item href="#roles">Roles</DropdownMenu.Item>
                <DropdownMenu.Item href="#users">Users</DropdownMenu.Item>
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
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        blockSize: 240,
      }}
    >
      <TopNavbar aria-label="Main navigation">
        <TopNavbar.Container placement="start">
          <TopNavbar.AppItem icon={<AppIcon />} href="#">
            Super Long Menu Title with Line Wrap and Ellipsis Truncation
          </TopNavbar.AppItem>
          <TopNavbar.Item icon={<IconFolder16 />} href="#">
            Integrations
          </TopNavbar.Item>
        </TopNavbar.Container>
      </TopNavbar>

      <main
        className={flex({ direction: 'column', gap: 'm' }, spacing({ p: 'm' }))}
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

export const CollapsingItems: Story = {
  parameters: {
    docs: {
      source: { type: 'code' },
    },
  },
  render: function Render() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const sections = [
      { href: '#overview', label: 'Overview' },
      { href: '#incidents', label: 'Incidents' },
      { href: '#assets', label: 'Assets' },
      { href: '#vulnerabilities', label: 'Vulnerabilities' },
      { href: '#integrations', label: 'Integrations' },
      { href: '#reports', label: 'Reports' },
      { href: '#settings', label: 'Settings' },
    ];

    const hiddenStyle: CSSProperties = {
      visibility: 'hidden',
      position: 'absolute',
      insetInlineStart: '-300vw',
    };

    const moreIndex = sections.length;

    const { parentRef, visibleMap, itemsRefs } = useHideOverflowItems<
      HTMLElement,
      HTMLDivElement
    >({
      length: sections.length + 1,
      moreIndex,
    });

    const hiddenSections = sections.filter((_, index) => !visibleMap[index]);

    const isMoreVisible = visibleMap[moreIndex];

    const setItemRef = (index: number, element: HTMLElement | null) => {
      const itemRef = itemsRefs[index];

      if (itemRef && element) itemRef.current = element;
    };

    useEffect(() => {
      if (!isMoreVisible) setIsMenuOpen(false);
    }, [isMoreVisible]);

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          inlineSize: 900,
          maxInlineSize: '100%',
          minInlineSize: 480,
          blockSize: 240,
          boxSizing: 'border-box',
          resize: 'horizontal',
          overflow: 'hidden',
        }}
      >
        <TopNavbar aria-label="Main navigation" style={{ minInlineSize: 0 }}>
          <TopNavbar.Container
            placement="start"
            style={{ flex: '1 1 0', overflow: 'hidden' }}
          >
            <TopNavbar.AppItem icon={<AppIcon />} href="#">
              App name
            </TopNavbar.AppItem>

            <div
              ref={parentRef}
              style={{
                position: 'relative',
                display: 'flex',
                flex: '1 1 0',
                minInlineSize: 0,
                overflow: 'hidden',
              }}
            >
              {sections.map((section, index) => (
                <TopNavbar.Item
                  key={section.href}
                  ref={(element) => setItemRef(index, element)}
                  href={section.href}
                  style={visibleMap[index] ? undefined : hiddenStyle}
                  aria-hidden={!visibleMap[index] || undefined}
                >
                  {section.label}
                </TopNavbar.Item>
              ))}

              <DropdownMenu isOpen={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <TopNavbar.Item
                  as="button"
                  ref={(element) => setItemRef(moreIndex, element)}
                  style={isMoreVisible ? undefined : hiddenStyle}
                  aria-hidden={!isMoreVisible || undefined}
                >
                  More
                </TopNavbar.Item>
                <DropdownMenu.Popover>
                  <DropdownMenu.Content>
                    {hiddenSections.map((section) => (
                      <DropdownMenu.Item key={section.href} href={section.href}>
                        {section.label}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Popover>
              </DropdownMenu>
            </div>
          </TopNavbar.Container>

          <TopNavbar.Container placement="end">
            <TopNavbar.Item
              icon={<IconBell16 />}
              as="button"
              badge={5}
              aria-label="Notifications"
            />
            <TopNavbar.Item
              icon={<IconUser16 />}
              as="button"
              aria-label="Profile"
            />
          </TopNavbar.Container>
        </TopNavbar>

        <main
          className={flex(
            { direction: 'column', gap: 'm' },
            spacing({ p: 'm' })
          )}
          style={{ flex: '1 1 auto', minInlineSize: 0 }}
        >
          <Typography variant="title">Main content</Typography>
          <Typography>
            Resize this example to see navigation sections move into the More
            menu when the available space becomes limited.
          </Typography>
        </main>
      </div>
    );
  },
};

export const RouteProvider: Story = {
  render: () => (
    <RouterProvider navigate={(path) => alert(path)}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          blockSize: 240,
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
            <DropdownMenu>
              <TopNavbar.Item>Reports</TopNavbar.Item>
              <DropdownMenu.Popover>
                <DropdownMenu.Content>
                  <DropdownMenu.Item href="/reports/daily">
                    Daily
                  </DropdownMenu.Item>
                  <DropdownMenu.Item href="/reports/weekly">
                    Weekly
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Popover>
            </DropdownMenu>
          </TopNavbar.Container>
        </TopNavbar>

        <main
          className={flex(
            { direction: 'column', gap: 'm' },
            spacing({ p: 'm' })
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
