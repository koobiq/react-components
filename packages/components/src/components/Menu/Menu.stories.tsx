import { useState } from 'react';

import {
  IconAlignCenter16,
  IconAlignLeft16,
  IconAlignRight16,
  IconTextBold16,
  IconTextUnderline16,
} from '@koobiq/react-icons';
import type { StoryObj } from '@storybook/react';

import type { Selection } from '../../types';
import { Button } from '../Button';
import { FlexBox } from '../FlexBox';

import { Menu, MenuItem, MenuSection } from './index';
import type { MenuProps } from './index';

const meta = {
  title: 'Components/Menu',
  component: Menu,
  subcomponents: {},
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: MenuProps<object>) => (
    <Menu control={(props) => <Button {...props}>Menu</Button>} {...args}>
      <MenuItem key="open">Open</MenuItem>
      <MenuItem key="rename">Rename…</MenuItem>
      <MenuItem key="duplicate">Duplicate</MenuItem>
      <MenuItem key="delete">Delete…</MenuItem>
    </Menu>
  ),
};

export const Content: Story = {
  render: function Render() {
    const items = [
      { id: 'new', name: 'New', href: '#' },
      { id: 'open', name: 'Open', href: '#' },
      { id: 'close', name: 'Close' },
      { id: 'save', name: 'Save' },
      { id: 'duplicate', name: 'Duplicate' },
      { id: 'rename', name: 'Rename' },
      { id: 'move', name: 'Move' },
    ];

    return (
      <Menu
        items={items}
        onAction={(id) => alert(id)}
        control={(props) => <Button {...props}>Actions</Button>}
      >
        {(item) => <MenuItem href={item.href}>{item.name}</MenuItem>}
      </Menu>
    );
  },
};

export const SelectionSingle: Story = {
  name: 'Single selection',
  render: function Render() {
    const [selected, setSelected] = useState<Selection>(new Set(['console']));

    const items = [
      { id: 'console', name: 'Console' },
      { id: 'searchbar', name: 'Searchbar' },
      { id: 'tools', name: 'Tools' },
      { id: 'sidebar', name: 'Sidebar' },
    ];

    return (
      <Menu
        items={items}
        selectionMode="single"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        control={(props) => <Button {...props}>View</Button>}
      >
        {(item) => <MenuItem key={item.id}>{item.name}</MenuItem>}
      </Menu>
    );
  },
};

export const SelectionMultiple: Story = {
  name: 'Multiple selection',
  render: function Render() {
    const [selected, setSelected] = useState<Selection>(
      new Set(['sidebar', 'console'])
    );

    const items = [
      { id: 'console', name: 'Console' },
      { id: 'searchbar', name: 'Searchbar' },
      { id: 'tools', name: 'Tools' },
      { id: 'sidebar', name: 'Sidebar' },
    ];

    return (
      <Menu
        items={items}
        selectedKeys={selected}
        selectionMode="multiple"
        onSelectionChange={setSelected}
        control={(props) => <Button {...props}>View</Button>}
      >
        {(item) => <MenuItem key={item.id}>{item.name}</MenuItem>}
      </Menu>
    );
  },
};

export const DisabledItems = {
  name: 'Disabled items',
  render: () => {
    const options = [
      { id: 'copy', name: 'Copy' },
      { id: 'cut', name: 'Cut' },
      { id: 'paste', name: 'Paste' },
    ];

    return (
      <Menu
        items={options}
        disabledKeys={['paste']}
        control={(props) => <Button {...props}>Actions</Button>}
      >
        {(item) => <MenuItem>{item.name}</MenuItem>}
      </Menu>
    );
  },
};

export const Links = {
  render: () => (
    <Menu
      aria-label="Links"
      control={(props) => <Button {...props}>Actions</Button>}
    >
      <MenuItem href="https://apple.com/" target="_blank">
        Apple
      </MenuItem>
      <MenuItem href="https://google.com/" target="_blank">
        Google
      </MenuItem>
      <MenuItem href="https://microsoft.com/" target="_blank">
        Microsoft
      </MenuItem>
    </Menu>
  ),
};

export const Sections = {
  render: function Render() {
    const options = [
      {
        name: 'Styles',
        children: [
          { id: 2, name: 'Bold' },
          { id: 3, name: 'Underline' },
        ],
      },
      {
        name: 'Align',
        children: [
          { id: 6, name: 'Left' },
          { id: 7, name: 'Middle' },
          { id: 8, name: 'Right' },
        ],
      },
    ];

    return (
      <FlexBox alignItems="stretch" gap="l">
        <Menu control={(props) => <Button {...props}>Actions</Button>}>
          <MenuSection title="Styles">
            <MenuItem>
              <IconTextBold16 />
              Bold
            </MenuItem>
            <MenuItem>
              <IconTextUnderline16 />
              Underline
            </MenuItem>
          </MenuSection>
          <MenuSection title="Align">
            <MenuItem>
              <IconAlignLeft16 />
              Left
            </MenuItem>
            <MenuItem>
              <IconAlignCenter16 />
              Middle
            </MenuItem>
            <MenuItem>
              <IconAlignRight16 />
              Right
            </MenuItem>
          </MenuSection>
        </Menu>
        <Menu
          items={options}
          control={(props) => <Button {...props}>Actions</Button>}
        >
          {(item) => (
            <MenuSection
              key={item.name}
              items={item.children}
              title={item.name}
            >
              {(item) => <MenuItem>{item.name}</MenuItem>}
            </MenuSection>
          )}
        </Menu>
      </FlexBox>
    );
  },
};
