import { type Key, useState } from 'react';

import {
  IconChevronRight16,
  IconChevronDownS16,
  IconHouse16,
  IconUser16,
} from '@koobiq/react-icons';
import { Button } from '@koobiq/react-primitives';
import { linkTo } from '@storybook/addon-links';
import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { IconButton } from '../IconButton';
import { Menu } from '../Menu';
import { Provider } from '../Provider';
import { Tooltip } from '../Tooltip';
import { Typography } from '../Typography';

import { Breadcrumbs, BreadcrumbItem, breadcrumbsPropSize } from './index.js';

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  subcomponents: { BreadcrumbItem },
  parameters: {
    layout: 'padded',
  },
  tags: ['status:new', 'date:2025-12-25'],
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Base: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <BreadcrumbItem onPress={() => alert('Pressed Home')}>
        Home
      </BreadcrumbItem>
      <BreadcrumbItem onPress={() => alert('Pressed Documentation')}>
        Documentation
      </BreadcrumbItem>
      <BreadcrumbItem>Components</BreadcrumbItem>
      <BreadcrumbItem>Navigation</BreadcrumbItem>
      <BreadcrumbItem>Breadcrumbs</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const Size: Story = {
  render: (args) => (
    <FlexBox gap="l" direction="column">
      {breadcrumbsPropSize.map((size) => (
        <FlexBox
          gap="s"
          key={size}
          direction="column"
          style={{ inlineSize: '100%' }}
        >
          <Typography>{size}</Typography>
          <Breadcrumbs size={size} {...args}>
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbItem>Documentation</BreadcrumbItem>
            <BreadcrumbItem>Components</BreadcrumbItem>
            <BreadcrumbItem>Navigation</BreadcrumbItem>
            <BreadcrumbItem>Breadcrumbs</BreadcrumbItem>
          </Breadcrumbs>
        </FlexBox>
      ))}
    </FlexBox>
  ),
};

export const Separator: Story = {
  render: (args) => (
    <Breadcrumbs {...args} separator={<IconChevronRight16 />}>
      <BreadcrumbItem>Home</BreadcrumbItem>
      <BreadcrumbItem>Documentation</BreadcrumbItem>
      <BreadcrumbItem>Components</BreadcrumbItem>
      <BreadcrumbItem>Navigation</BreadcrumbItem>
      <BreadcrumbItem>Breadcrumbs</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <BreadcrumbItem isDisabled>Home</BreadcrumbItem>
      <BreadcrumbItem>Documentation</BreadcrumbItem>
      <BreadcrumbItem>Components</BreadcrumbItem>
      <BreadcrumbItem>Navigation</BreadcrumbItem>
      <BreadcrumbItem>Breadcrumbs</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const Addons: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <BreadcrumbItem startAddon={<IconHouse16 />} />
      <BreadcrumbItem startAddon={<IconUser16 />}>
        Application List
      </BreadcrumbItem>
      <BreadcrumbItem>Application</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const CustomItems: Story = {
  render: function Render(args) {
    return (
      <>
        <Breadcrumbs {...args}>
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Page 1</BreadcrumbItem>
          <BreadcrumbItem>Page 2</BreadcrumbItem>
          <Menu
            control={(props) => (
              <BreadcrumbItem
                {...props}
                // Use `Button` from `@koobiq/react-primitives`.
                as={Button}
                endAddon={<IconChevronDownS16 />}
              >
                Page 3
              </BreadcrumbItem>
            )}
          >
            <Menu.Item key="page-3-1">Page 3-1</Menu.Item>
            <Menu.Item key="page-3-2">Page 3-2</Menu.Item>
          </Menu>
        </Breadcrumbs>
      </>
    );
  },
};

export const CollapsingItems: Story = {
  render: (args) => (
    <FlexBox style={{ maxInlineSize: 400 }}>
      <Breadcrumbs {...args}>
        <BreadcrumbItem href="#">Home</BreadcrumbItem>
        <BreadcrumbItem href="#">Documentation</BreadcrumbItem>
        <BreadcrumbItem href="#">Components</BreadcrumbItem>
        <BreadcrumbItem href="#">Navigation</BreadcrumbItem>
        <BreadcrumbItem>Breadcrumbs</BreadcrumbItem>
      </Breadcrumbs>
    </FlexBox>
  ),
};

export const CustomEllipsisItem: Story = {
  render: function Render(args) {
    return (
      <FlexBox style={{ maxInlineSize: 400 }}>
        <Breadcrumbs
          ellipsisIndex={5}
          renderEllipsis={({ ellipsisIcon, items }) => (
            <>
              <Menu
                control={(props) => (
                  <IconButton {...props} variant="fade-contrast">
                    {ellipsisIcon}
                  </IconButton>
                )}
              >
                {items.map((item, i) => (
                  <Menu.Item key={i} href={item.href}>
                    <Menu.ItemText>{item.children}</Menu.ItemText>
                  </Menu.Item>
                ))}
              </Menu>
            </>
          )}
          {...args}
        >
          <BreadcrumbItem href="#">Home</BreadcrumbItem>
          <BreadcrumbItem href="#">Documentation</BreadcrumbItem>
          <BreadcrumbItem href="#">Components</BreadcrumbItem>
          <BreadcrumbItem href="#">Navigation</BreadcrumbItem>
          <BreadcrumbItem>Breadcrumbs</BreadcrumbItem>
        </Breadcrumbs>
      </FlexBox>
    );
  },
};

export const WrapItems: Story = {
  render: (args) => (
    <FlexBox style={{ maxInlineSize: 400 }}>
      <Breadcrumbs overflowMode="wrap" {...args}>
        <BreadcrumbItem href="#">Home</BreadcrumbItem>
        <BreadcrumbItem href="#">Documentation</BreadcrumbItem>
        <BreadcrumbItem href="#">Components</BreadcrumbItem>
        <BreadcrumbItem href="#">Navigation</BreadcrumbItem>
        <BreadcrumbItem>Breadcrumbs</BreadcrumbItem>
      </Breadcrumbs>
    </FlexBox>
  ),
};

export const TruncatedItems: Story = {
  render: function Render() {
    return (
      <FlexBox direction="column" gap="l" style={{ maxInlineSize: 400 }}>
        <Breadcrumbs>
          <BreadcrumbItem>Components</BreadcrumbItem>
          <BreadcrumbItem>Commit</BreadcrumbItem>
          <BreadcrumbItem>
            <Tooltip
              control={(props) => (
                <Typography
                  as="span"
                  variant="inherit"
                  style={{ maxInlineSize: 96 }}
                  {...props}
                  ellipsis
                >
                  cacb86c728451b57740706d19429e6629140b7c5
                </Typography>
              )}
              placement="bottom"
              hideArrow
            >
              cacb86c728451b57740706d19429e6629140b7c5
            </Tooltip>
          </BreadcrumbItem>
        </Breadcrumbs>
        <Breadcrumbs>
          <BreadcrumbItem>Components</BreadcrumbItem>
          <BreadcrumbItem>Commit</BreadcrumbItem>
          <BreadcrumbItem>
            <Tooltip
              control={(props) => (
                <Typography
                  as="span"
                  variant="inherit"
                  style={{ maxInlineSize: 96, direction: 'rtl' }}
                  {...props}
                  ellipsis
                >
                  cacb86c728451b57740706d19429e6629140b7c5
                </Typography>
              )}
              placement="bottom"
              hideArrow
            >
              cacb86c728451b57740706d19429e6629140b7c5
            </Tooltip>
          </BreadcrumbItem>
        </Breadcrumbs>
        <Breadcrumbs>
          <BreadcrumbItem>Group</BreadcrumbItem>
          <BreadcrumbItem>Users</BreadcrumbItem>
          <BreadcrumbItem>
            <Tooltip
              control={(props) => (
                <span
                  style={{ maxInlineSize: 140, display: 'flex' }}
                  {...props}
                >
                  <Typography as="span" variant="inherit" ellipsis>
                    Report dated
                  </Typography>
                  <Typography as="span" aria-hidden="true">
                    &nbsp;
                  </Typography>
                  <Typography as="span" variant="inherit">
                    23.12.2025
                  </Typography>
                </span>
              )}
              placement="bottom"
              hideArrow
            >
              Report dated 23.12.2025
            </Tooltip>
          </BreadcrumbItem>
        </Breadcrumbs>
      </FlexBox>
    );
  },
};

export const Controlled: Story = {
  render: function Render(args) {
    const [currentPage, setCurrentPage] = useState<Key>('home');

    return (
      <Breadcrumbs onAction={(key) => setCurrentPage(key)} {...args}>
        <BreadcrumbItem key="home" isCurrent={currentPage === 'home'}>
          Home
        </BreadcrumbItem>
        <BreadcrumbItem
          key="documentation"
          isCurrent={currentPage === 'documentation'}
        >
          Documentation
        </BreadcrumbItem>
        <BreadcrumbItem
          key="components"
          isCurrent={currentPage === 'components'}
        >
          Components
        </BreadcrumbItem>
        <BreadcrumbItem
          key="navigation"
          isCurrent={currentPage === 'navigation'}
        >
          Navigation
        </BreadcrumbItem>
        <BreadcrumbItem
          key="breadcrumbs"
          isCurrent={currentPage === 'breadcrumbs'}
        >
          Breadcrumbs
        </BreadcrumbItem>
      </Breadcrumbs>
    );
  },
};

export const Routing: Story = {
  render: function Render(args) {
    return (
      <Provider
        router={{
          navigate: (href) => {
            linkTo(href)();
          },
        }}
      >
        <Breadcrumbs {...args}>
          <BreadcrumbItem href="/Components/Button">Button</BreadcrumbItem>
          <BreadcrumbItem href="/Components/Tabs">Tabs</BreadcrumbItem>
          <BreadcrumbItem href="/Components/Checkbox">Checkbox</BreadcrumbItem>
          <BreadcrumbItem href="/Components/Breadcrumbs">
            Breadcrumbs
          </BreadcrumbItem>
        </Breadcrumbs>
      </Provider>
    );
  },
};
