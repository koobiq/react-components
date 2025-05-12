import { useState } from 'react';

import type { StoryObj } from '@storybook/react';

import type { Selection } from '../../types';
import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Typography } from '../Typography';

import { Menu } from './index';
import type { MenuProps } from './index';

const meta = {
  title: 'Components/Menu',
  component: Menu,
  subcomponents: {
    'Menu.Item': Menu.Item,
    'Menu.Section': Menu.Section,
    'Menu.ItemText': Menu.ItemText,
    'Menu.Divider': Menu.Divider,
    'Menu.Header': Menu.Header,
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: MenuProps<object>) => (
    <Menu control={(props) => <Button {...props}>Menu</Button>} {...args}>
      <Menu.Header key="header">
        <Typography
          variant="caps-compact"
          style={{ padding: '1em' }}
          align="center"
        >
          Header
        </Typography>
      </Menu.Header>
      <Menu.Divider />
      <Menu.Item key="open">Open</Menu.Item>
      <Menu.Item key="rename">Rename…</Menu.Item>
      <Menu.Item key="duplicate">Duplicate</Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" textValue="Delete">
        <Menu.ItemText slotProps={{ text: { color: 'error' } }}>
          Delete…
        </Menu.ItemText>
      </Menu.Item>
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
        {(item) => <Menu.Item href={item.href}>{item.name}</Menu.Item>}
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
        {(item) => <Menu.Item key={item.id}>{item.name}</Menu.Item>}
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
      { type: 'separator', id: 'separator-1' },
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
        {(item) =>
          item.type === 'separator' ? (
            <Menu.Divider key={item.id} />
          ) : (
            <Menu.Item key={item.id}>{item.name}</Menu.Item>
          )
        }
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
        {(item) => <Menu.Item>{item.name}</Menu.Item>}
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
      <Menu.Item href="https://apple.com/" target="_blank">
        Apple
      </Menu.Item>
      <Menu.Item href="https://google.com/" target="_blank">
        Google
      </Menu.Item>
      <Menu.Item href="https://microsoft.com/" target="_blank">
        Microsoft
      </Menu.Item>
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
      { type: 'divider', id: 'divider-2' },
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
          <Menu.Section title="Styles">
            <Menu.Item>Bold</Menu.Item>
            <Menu.Item>Underline</Menu.Item>
          </Menu.Section>
          <Menu.Divider />
          <Menu.Section title="Align">
            <Menu.Item>Left</Menu.Item>
            <Menu.Item>Middle</Menu.Item>
            <Menu.Item>Right</Menu.Item>
          </Menu.Section>
        </Menu>
        <Menu
          items={options}
          control={(props) => <Button {...props}>Actions</Button>}
        >
          {(item) =>
            item.type === 'divider' ? (
              <Menu.Divider />
            ) : (
              <Menu.Section
                key={item.name}
                items={item.children}
                title={item.name}
              >
                {(item) => <Menu.Item>{item.name}</Menu.Item>}
              </Menu.Section>
            )
          }
        </Menu>
      </FlexBox>
    );
  },
};
