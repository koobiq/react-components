import { useRef, useState } from 'react';

import { useBoolean } from '@koobiq/react-core';
import {
  IconChevronRight16,
  IconChevronDownS16,
  IconArrowLeft16,
  IconSquareMultipleO16,
} from '@koobiq/react-icons';
import { linkTo } from '@storybook/addon-links';
import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { Menu } from '../Menu';
import { Provider } from '../Provider';

import { Breadcrumbs, BreadcrumbItem, breadcrumbsPropSize } from './index.js';

const meta = {
  title: 'Components/Breadcrumbs',
  component: Breadcrumbs,
  subcomponents: { BreadcrumbItem },
  parameters: {
    layout: 'padded',
  },
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
        <Breadcrumbs size={size} key={size} {...args}>
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Documentation</BreadcrumbItem>
          <BreadcrumbItem>Components</BreadcrumbItem>
          <BreadcrumbItem>Navigation</BreadcrumbItem>
          <BreadcrumbItem>Breadcrumbs</BreadcrumbItem>
        </Breadcrumbs>
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
      <BreadcrumbItem startAddon={<IconArrowLeft16 />} />
      <BreadcrumbItem>Projects</BreadcrumbItem>
      <BreadcrumbItem>Koobiq React</BreadcrumbItem>
      <BreadcrumbItem>Issues</BreadcrumbItem>
      <BreadcrumbItem endAddon={<IconSquareMultipleO16 />} isCurrent={false}>
        KBQ-1025
      </BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const CustomItems: Story = {
  render: function Render(args) {
    const [isOpen, { toggle, set }] = useBoolean(false);
    const anchorRef = useRef<HTMLButtonElement>(null);

    return (
      <>
        <Menu isOpen={isOpen} anchorRef={anchorRef} onOpenChange={set}>
          <Menu.Item key="page-3-1">Page 3-1</Menu.Item>
          <Menu.Item key="page-3-2">Page 3-2</Menu.Item>
        </Menu>
        <Breadcrumbs {...args}>
          <BreadcrumbItem>Home</BreadcrumbItem>
          <BreadcrumbItem>Page 1</BreadcrumbItem>
          <BreadcrumbItem>Page 2</BreadcrumbItem>
          <BreadcrumbItem
            as="button"
            isCurrent={false}
            ref={anchorRef}
            onClick={toggle}
            endAddon={<IconChevronDownS16 />}
          >
            Page 3
          </BreadcrumbItem>
        </Breadcrumbs>
      </>
    );
  },
};

export const CollapsingItems: Story = {
  render: (args) => (
    <FlexBox style={{ width: 400 }}>
      <Breadcrumbs {...args}>
        <BreadcrumbItem>Home</BreadcrumbItem>
        <BreadcrumbItem>Documentation</BreadcrumbItem>
        <BreadcrumbItem>Components</BreadcrumbItem>
        <BreadcrumbItem>Navigation</BreadcrumbItem>
        <BreadcrumbItem>Breadcrumbs</BreadcrumbItem>
      </Breadcrumbs>
    </FlexBox>
  ),
};

export const Controlled: Story = {
  render: function Render(args) {
    const [currentPage, setCurrentPage] = useState<string>('home');

    const handleOnPress = (key: string) => () => {
      setCurrentPage(key);
    };

    return (
      <Breadcrumbs {...args}>
        <BreadcrumbItem
          key="home"
          onPress={handleOnPress('home')}
          isCurrent={currentPage === 'home'}
        >
          Home
        </BreadcrumbItem>
        <BreadcrumbItem
          key="documentation"
          onPress={handleOnPress('documentation')}
          isCurrent={currentPage === 'documentation'}
        >
          Documentation
        </BreadcrumbItem>
        <BreadcrumbItem
          key="components"
          onPress={handleOnPress('components')}
          isCurrent={currentPage === 'components'}
        >
          Components
        </BreadcrumbItem>
        <BreadcrumbItem
          key="navigation"
          onPress={handleOnPress('navigation')}
          isCurrent={currentPage === 'navigation'}
        >
          Navigation
        </BreadcrumbItem>
        <BreadcrumbItem
          key="breadcrumbs"
          onPress={handleOnPress('breadcrumbs')}
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
