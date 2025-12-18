import { useRef, useState } from 'react';

import { useBoolean } from '@koobiq/react-core';
import {
  IconHouse16,
  IconGridDots16,
  IconSquare16,
  IconChevronRight16,
  IconChevronDownS16,
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
    layout: 'centered',
  },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof Breadcrumbs>;

export const Base: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <BreadcrumbItem onPress={() => alert('Pressed Folder 1')}>
        Folder 1
      </BreadcrumbItem>
      <BreadcrumbItem onPress={() => alert('Pressed Folder 2')}>
        Folder 2
      </BreadcrumbItem>
      <BreadcrumbItem>Folder 3</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const Size: Story = {
  render: (args) => (
    <FlexBox gap="l" direction="column">
      {breadcrumbsPropSize.map((size) => (
        <Breadcrumbs {...args} key={size} size={size}>
          <BreadcrumbItem onPress={() => alert('Pressed Folder 1')}>
            Folder 1
          </BreadcrumbItem>
          <BreadcrumbItem onPress={() => alert('Pressed Folder 2')}>
            Folder 2
          </BreadcrumbItem>
          <BreadcrumbItem>Folder 3</BreadcrumbItem>
        </Breadcrumbs>
      ))}
    </FlexBox>
  ),
};

export const Separator: Story = {
  render: (args) => (
    <Breadcrumbs {...args} separator={<IconChevronRight16 />}>
      <BreadcrumbItem onPress={() => alert('Pressed Folder 1')}>
        Folder 1
      </BreadcrumbItem>
      <BreadcrumbItem onPress={() => alert('Pressed Folder 2')}>
        Folder 2
      </BreadcrumbItem>
      <BreadcrumbItem>Folder 3</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <BreadcrumbItem isDisabled onPress={() => alert('Pressed Folder 1')}>
        Folder 1
      </BreadcrumbItem>
      <BreadcrumbItem onPress={() => alert('Pressed Folder 2')}>
        Folder 2
      </BreadcrumbItem>
      <BreadcrumbItem>Folder 3</BreadcrumbItem>
    </Breadcrumbs>
  ),
};

export const Icons: Story = {
  render: (args) => (
    <Breadcrumbs {...args}>
      <BreadcrumbItem startAddon={<IconHouse16 />} href="https://example.com">
        Koobiq React
      </BreadcrumbItem>
      <BreadcrumbItem
        startAddon={<IconSquare16 />}
        href="https://example.com/page-1"
      >
        Components
      </BreadcrumbItem>
      <BreadcrumbItem
        startAddon={<IconGridDots16 />}
        href="https://example.com/page-2"
      >
        Breadcrumbs
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

export const Controlled: Story = {
  render: function Render(args) {
    const [currentPage, setCurrentPage] = useState<string>('folder-1');

    const handleOnPress = (key: string) => () => {
      setCurrentPage(key);
    };

    return (
      <Breadcrumbs {...args}>
        <BreadcrumbItem
          key="folder-1"
          onPress={handleOnPress('folder-1')}
          isCurrent={currentPage === 'folder-1'}
        >
          Folder 1
        </BreadcrumbItem>
        <BreadcrumbItem
          key="folder-2"
          onPress={handleOnPress('folder-2')}
          isCurrent={currentPage === 'folder-2'}
        >
          Folder 2
        </BreadcrumbItem>
        <BreadcrumbItem
          key="folder-3"
          onPress={handleOnPress('folder-3')}
          isCurrent={currentPage === 'folder-3'}
        >
          Folder 3
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
          <BreadcrumbItem href="/Components/Tabs">Card</BreadcrumbItem>
          <BreadcrumbItem href="/Components/Checkbox">Checkbox</BreadcrumbItem>
          <BreadcrumbItem href="/Components/Breadcrumbs">
            Breadcrumbs
          </BreadcrumbItem>
        </Breadcrumbs>
      </Provider>
    );
  },
};
