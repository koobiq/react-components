import { type CSSProperties, useRef, useState } from 'react';

import { useBoolean } from '@koobiq/react-core';
import {
  IconArrowRightToBracket16,
  IconBell16,
  IconDashboard16,
  IconGear16,
  IconMessage16,
  IconPlus16,
} from '@koobiq/react-icons';
import type { StoryObj } from '@storybook/react';

import type { Selection } from '../../types';
import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { spacing } from '../layout';
import { popoverPropPlacement } from '../Popover';
import { Typography } from '../Typography';

import avatar from './__stories__/avatar.webp';
import type { MenuPropPlacement, MenuProps } from './index';
import { Menu } from './Menu';

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
    <Menu
      control={(props) => <Button {...props}>Actions</Button>}
      onAction={(key) => alert(key)}
      {...args}
    >
      <Menu.Item key="new">New</Menu.Item>
      <Menu.Item key="open">Open</Menu.Item>
      <Menu.Item key="close">Close</Menu.Item>
      <Menu.Item key="save">Save</Menu.Item>
      <Menu.Item key="duplicate">Duplicate</Menu.Item>
      <Menu.Item key="rename">Rename</Menu.Item>
      <Menu.Item key="move">Move</Menu.Item>
    </Menu>
  ),
};

export const Content: Story = {
  render: function Render() {
    const items = [
      { id: 'new', name: 'New' },
      { id: 'open', name: 'Open' },
      { id: 'close', name: 'Close' },
      { id: 'save', name: 'Save' },
      { id: 'duplicate', name: 'Duplicate' },
      { id: 'rename', name: 'Rename' },
      { id: 'move', name: 'Move' },
    ];

    return (
      <Menu
        items={items}
        onAction={(key) => alert(key)}
        control={(props) => <Button {...props}>Actions</Button>}
      >
        {(item) => <Menu.Item key={item.id}>{item.name}</Menu.Item>}
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
        {(item) => <Menu.Item key={item.id}>{item.name}</Menu.Item>}
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

export const SectionsStatic = {
  name: 'Sections: Static items',
  render: function Render() {
    return (
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
    );
  },
};

export const SectionsDynamic = {
  name: 'Sections: Dynamic items',
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
    );
  },
};

export const Placement: Story = {
  render: function Render() {
    const [selected, setSelected] = useState<Selection>(new Set(['top']));

    const options = popoverPropPlacement.map((placement) => ({
      id: placement,
    }));

    return (
      <Menu
        items={options}
        placement={Array.from(selected)[0] as MenuPropPlacement}
        selectionMode="single"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        control={(props) => <Button {...props}>Placement</Button>}
      >
        {(item) => <Menu.Item>{item.id}</Menu.Item>}
      </Menu>
    );
  },
};

export const Open: Story = {
  render: function Render() {
    const options = [
      { id: 'copy', name: 'Copy' },
      { id: 'cut', name: 'Cut' },
      { id: 'paste', name: 'Paste' },
    ];

    const [open, { toggle, set }] = useBoolean(false);
    const anchorRef = useRef<HTMLButtonElement>(null);

    return (
      <FlexBox gap="m">
        <Menu
          open={open}
          items={options}
          onOpenChange={set}
          anchorRef={anchorRef}
        >
          {(item) => <Menu.Item>{item.name}</Menu.Item>}
        </Menu>
        <Button onPress={toggle} ref={anchorRef}>
          {open ? 'Close' : 'Open'}
        </Button>
      </FlexBox>
    );
  },
};

export const Dividers: Story = {
  render: function Render() {
    const buttonStyle: CSSProperties = {
      width: 48,
      height: 48,
      borderRadius: '50%',
      overflow: 'hidden',
      padding: 0,
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
    };

    const imgStyle: CSSProperties = {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block',
    };

    return (
      <Menu
        control={(props) => (
          <Menu.Control {...props}>
            <div role="button" style={buttonStyle}>
              <img src={avatar} alt="Sophia Bellmont" style={imgStyle} />
            </div>
          </Menu.Control>
        )}
      >
        <Menu.Header>
          <FlexBox gap="xs" direction="column" className={spacing({ p: 'm' })}>
            <Typography variant="text-normal-strong">
              Sophia Bellmont
            </Typography>
            <Typography color="contrast-secondary">@Sophia</Typography>
          </FlexBox>
        </Menu.Header>
        <Menu.Divider />
        <Menu.Item>
          <IconDashboard16 />
          Dashboard
        </Menu.Item>
        <Menu.Item>
          <IconBell16 />
          <Menu.ItemText>Notifications</Menu.ItemText>
        </Menu.Item>
        <Menu.Item>
          <IconPlus16 />
          Create team
        </Menu.Item>
        <Menu.Item>
          <IconGear16 />
          Settings
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <IconMessage16 />
          Contact Support
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <IconArrowRightToBracket16 />
          Log out
        </Menu.Item>
      </Menu>
    );
  },
};
