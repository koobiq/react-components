import type { CSSProperties } from 'react';
import { useState } from 'react';

import { useBoolean } from '@koobiq/react-core';
import {
  IconArrowRightToBracket16,
  IconBell16,
  IconFileMultipleO16,
  IconDashboard16,
  IconGear16,
  IconMessage16,
  IconPlus16,
  IconScissors16,
  IconTrash16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import type { Selection } from '../../index';
import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { spacing } from '../layout';
import { Typography } from '../Typography';

import avatar from './__stories__/avatar.webp';
import { DropdownMenu } from './DropdownMenu';
import type { DropdownMenuProps, DropdownMenuPropPlacement } from './index';
import { dropdownMenuPropPlacement } from './index';

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  subcomponents: {
    'DropdownMenu.Trigger': DropdownMenu.Trigger,
    'DropdownMenu.Content': DropdownMenu.Content,
    'DropdownMenu.Item': DropdownMenu.Item,
    'DropdownMenu.ItemText': DropdownMenu.ItemText,
    'DropdownMenu.ItemAddon': DropdownMenu.ItemAddon,
    'DropdownMenu.Section': DropdownMenu.Section,
    'DropdownMenu.Header': DropdownMenu.Header,
    'DropdownMenu.Separator': DropdownMenu.Separator,
    'DropdownMenu.SubmenuTrigger': DropdownMenu.SubmenuTrigger,
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['status:new', 'date:2026-08-06'],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<DropdownMenuProps>;

export const Base: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenu.Trigger>
        <Button>Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content onAction={(key) => alert(key)}>
        <DropdownMenu.Item id="new">New</DropdownMenu.Item>
        <DropdownMenu.Item id="open">Open</DropdownMenu.Item>
        <DropdownMenu.Item id="save">Save</DropdownMenu.Item>
        <DropdownMenu.Item id="duplicate">Duplicate</DropdownMenu.Item>
        <DropdownMenu.Item id="rename">Rename</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const Content: Story = {
  render: function Render(args) {
    const items = [
      { id: 'new', name: 'New' },
      { id: 'open', name: 'Open' },
      { id: 'save', name: 'Save' },
      { id: 'duplicate', name: 'Duplicate' },
      { id: 'rename', name: 'Rename' },
    ];

    return (
      <DropdownMenu {...args}>
        <DropdownMenu.Trigger>
          <Button>Actions</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content items={items} onAction={(key) => alert(key)}>
          {(item: (typeof items)[number]) => (
            <DropdownMenu.Item>{item.name}</DropdownMenu.Item>
          )}
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

export const ItemContent: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenu.Trigger>
        <Button>Edit</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content onAction={(key) => alert(key)}>
        <DropdownMenu.Item id="copy" align="start">
          <DropdownMenu.ItemAddon>
            <IconFileMultipleO16 />
          </DropdownMenu.ItemAddon>
          <DropdownMenu.ItemText caption="Copy to the clipboard">
            Copy
          </DropdownMenu.ItemText>
          <DropdownMenu.ItemAddon>
            <Typography color="contrast-tertiary" variant="text-compact">
              ⌘C
            </Typography>
          </DropdownMenu.ItemAddon>
        </DropdownMenu.Item>
        <DropdownMenu.Item id="cut" align="start">
          <DropdownMenu.ItemAddon>
            <IconScissors16 />
          </DropdownMenu.ItemAddon>
          <DropdownMenu.ItemText caption="Move to the clipboard">
            Cut
          </DropdownMenu.ItemText>
          <DropdownMenu.ItemAddon>
            <Typography color="contrast-tertiary" variant="text-compact">
              ⌘X
            </Typography>
          </DropdownMenu.ItemAddon>
        </DropdownMenu.Item>
        <DropdownMenu.Item id="delete" align="start">
          <DropdownMenu.ItemAddon>
            <IconTrash16 />
          </DropdownMenu.ItemAddon>
          <DropdownMenu.ItemText caption="Cannot be undone">
            Delete
          </DropdownMenu.ItemText>
          <DropdownMenu.ItemAddon>
            <Typography color="contrast-tertiary" variant="text-compact">
              ⌫
            </Typography>
          </DropdownMenu.ItemAddon>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const SelectionSingle: Story = {
  render: function Render(args) {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(
      new Set(['medium'])
    );

    return (
      <DropdownMenu {...args}>
        <DropdownMenu.Trigger>
          <Button>Text size</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          selectionMode="single"
          selectedKeys={selectedKeys}
          disallowEmptySelection
          onSelectionChange={setSelectedKeys}
        >
          <DropdownMenu.Item id="small">Small</DropdownMenu.Item>
          <DropdownMenu.Item id="medium">Medium</DropdownMenu.Item>
          <DropdownMenu.Item id="large">Large</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

export const SelectionMultiple: Story = {
  render: function Render(args) {
    const [selectedKeys, setSelectedKeys] = useState<Selection>(
      new Set(['sidebar'])
    );

    return (
      <DropdownMenu {...args}>
        <DropdownMenu.Trigger>
          <Button>View</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content
          selectionMode="multiple"
          selectedKeys={selectedKeys}
          onSelectionChange={setSelectedKeys}
        >
          <DropdownMenu.Item id="sidebar">Sidebar</DropdownMenu.Item>
          <DropdownMenu.Item id="searchbar">Search bar</DropdownMenu.Item>
          <DropdownMenu.Item id="console">Console</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

export const DisabledItems: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenu.Trigger>
        <Button>Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        disabledKeys={['open']}
        onAction={(key) => alert(key)}
      >
        <DropdownMenu.Item id="new">New</DropdownMenu.Item>
        <DropdownMenu.Item id="open">Open</DropdownMenu.Item>
        <DropdownMenu.Item id="save" isDisabled>
          Save
        </DropdownMenu.Item>
        <DropdownMenu.Item id="rename">Rename</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const Links: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenu.Trigger>
        <Button>Links</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item href="https://react.koobiq.io" target="_blank">
          Koobiq React
        </DropdownMenu.Item>
        <DropdownMenu.Item href="https://koobiq.io" target="_blank">
          Koobiq
        </DropdownMenu.Item>
        <DropdownMenu.Item
          href="https://github.com/koobiq/react-components"
          target="_blank"
        >
          GitHub
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const Sections: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenu.Trigger>
        <Button>Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content onAction={(key) => alert(key)}>
        <DropdownMenu.Section title="File">
          <DropdownMenu.Item id="new">New</DropdownMenu.Item>
          <DropdownMenu.Item id="open">Open</DropdownMenu.Item>
        </DropdownMenu.Section>
        <DropdownMenu.Section title="Edit">
          <DropdownMenu.Item id="copy">Copy</DropdownMenu.Item>
          <DropdownMenu.Item id="cut">Cut</DropdownMenu.Item>
          <DropdownMenu.Item id="paste">Paste</DropdownMenu.Item>
        </DropdownMenu.Section>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const SectionsDynamic: Story = {
  render: function Render(args) {
    const sections = [
      {
        name: 'File',
        children: [
          { id: 'new', name: 'New' },
          { id: 'open', name: 'Open' },
        ],
      },
      {
        name: 'Edit',
        children: [
          { id: 'copy', name: 'Copy' },
          { id: 'cut', name: 'Cut' },
          { id: 'paste', name: 'Paste' },
        ],
      },
    ];

    return (
      <DropdownMenu {...args}>
        <DropdownMenu.Trigger>
          <Button>Actions</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content items={sections} onAction={(key) => alert(key)}>
          {(section: (typeof sections)[number]) => (
            <DropdownMenu.Section
              id={section.name}
              title={section.name}
              items={section.children}
            >
              {(item: { id: string; name: string }) => (
                <DropdownMenu.Item>{item.name}</DropdownMenu.Item>
              )}
            </DropdownMenu.Section>
          )}
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

export const Separators: Story = {
  render: function Render(args) {
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
      <DropdownMenu {...args}>
        <DropdownMenu.Trigger>
          <DropdownMenu.Pressable>
            <div role="button" style={buttonStyle}>
              <img src={avatar} alt="Sophia Bellmont" style={imgStyle} />
            </div>
          </DropdownMenu.Pressable>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content onAction={(key) => alert(key)}>
          <DropdownMenu.Header>
            <FlexBox
              gap="xs"
              direction="column"
              className={spacing({ p: 'm' })}
            >
              <Typography variant="text-normal-strong">
                Sophia Bellmont
              </Typography>
              <Typography color="contrast-secondary">@Sophia</Typography>
            </FlexBox>
          </DropdownMenu.Header>
          <DropdownMenu.Separator />
          <DropdownMenu.Item id="dashboard">
            <DropdownMenu.ItemAddon>
              <IconDashboard16 />
            </DropdownMenu.ItemAddon>
            <DropdownMenu.ItemText>Dashboard</DropdownMenu.ItemText>
          </DropdownMenu.Item>
          <DropdownMenu.Item id="notifications">
            <DropdownMenu.ItemAddon>
              <IconBell16 />
            </DropdownMenu.ItemAddon>
            <DropdownMenu.ItemText>Notifications</DropdownMenu.ItemText>
          </DropdownMenu.Item>
          <DropdownMenu.Item id="create-team">
            <DropdownMenu.ItemAddon>
              <IconPlus16 />
            </DropdownMenu.ItemAddon>
            <DropdownMenu.ItemText>Create team</DropdownMenu.ItemText>
          </DropdownMenu.Item>
          <DropdownMenu.Item id="settings">
            <DropdownMenu.ItemAddon>
              <IconGear16 />
            </DropdownMenu.ItemAddon>
            <DropdownMenu.ItemText>Settings</DropdownMenu.ItemText>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item id="support">
            <DropdownMenu.ItemAddon>
              <IconMessage16 />
            </DropdownMenu.ItemAddon>
            <DropdownMenu.ItemText>Contact support</DropdownMenu.ItemText>
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item id="logout">
            <DropdownMenu.ItemAddon>
              <IconArrowRightToBracket16 />
            </DropdownMenu.ItemAddon>
            <DropdownMenu.ItemText>Log out</DropdownMenu.ItemText>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

export const Submenu: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenu.Trigger>
        <Button>Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content onAction={(key) => alert(key)}>
        <DropdownMenu.Item id="new">New</DropdownMenu.Item>
        <DropdownMenu.Item id="rename">Rename</DropdownMenu.Item>
        <DropdownMenu.SubmenuTrigger>
          <DropdownMenu.Item id="share">Share</DropdownMenu.Item>
          <DropdownMenu.Content onAction={(key) => alert(key)}>
            <DropdownMenu.Item id="email">Email</DropdownMenu.Item>
            <DropdownMenu.Item id="sms">SMS</DropdownMenu.Item>
            <DropdownMenu.SubmenuTrigger>
              <DropdownMenu.Item id="socials">Socials</DropdownMenu.Item>
              <DropdownMenu.Content onAction={(key) => alert(key)}>
                <DropdownMenu.Item id="telegram">Telegram</DropdownMenu.Item>
                <DropdownMenu.Item id="vk">VK</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.SubmenuTrigger>
          </DropdownMenu.Content>
        </DropdownMenu.SubmenuTrigger>
        <DropdownMenu.Separator />
        <DropdownMenu.Item id="delete">Delete</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const Search: Story = {
  render: function Render(args) {
    const items = [
      'Amsterdam',
      'Belgrade',
      'Berlin',
      'Bratislava',
      'Brussels',
      'Bucharest',
      'Budapest',
      'Copenhagen',
      'Dublin',
      'Helsinki',
      'Lisbon',
      'Ljubljana',
      'Madrid',
      'Oslo',
      'Prague',
      'Riga',
      'Rome',
      'Sofia',
      'Stockholm',
      'Vienna',
      'Warsaw',
    ];

    return (
      <DropdownMenu {...args}>
        <DropdownMenu.Trigger>
          <Button>Cities</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content isSearchable onAction={(key) => alert(key)}>
          {items.map((item) => (
            <DropdownMenu.Item key={item} id={item}>
              {item}
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.SubmenuTrigger>
            <DropdownMenu.Item id="other">Other cities</DropdownMenu.Item>
            <DropdownMenu.Content onAction={(key) => alert(key)}>
              <DropdownMenu.Item id="tallinn">Tallinn</DropdownMenu.Item>
              <DropdownMenu.Item id="vilnius">Vilnius</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.SubmenuTrigger>
        </DropdownMenu.Content>
      </DropdownMenu>
    );
  },
};

export const SearchEmpty: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenu.Trigger>
        <Button>Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content isSearchable noItemsText="No such action">
        <DropdownMenu.Item id="new">New</DropdownMenu.Item>
        <DropdownMenu.Item id="open">Open</DropdownMenu.Item>
        <DropdownMenu.Item id="save">Save</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const DropdownFooter: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenu.Trigger>
        <Button>Actions</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content dropdownFooter="The text in the footer of the drop-down list.">
        <DropdownMenu.Item id="new">New</DropdownMenu.Item>
        <DropdownMenu.Item id="open">Open</DropdownMenu.Item>
        <DropdownMenu.Item id="save">Save</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};

export const Placement: Story = {
  render: function Render(args) {
    const [placement, setPlacement] =
      useState<DropdownMenuPropPlacement>('bottom start');

    return (
      <FlexBox gap="m" alignItems="center" direction="column">
        <select
          value={placement}
          onChange={(e) =>
            setPlacement(e.target.value as DropdownMenuPropPlacement)
          }
        >
          {dropdownMenuPropPlacement.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <DropdownMenu {...args}>
          <DropdownMenu.Trigger>
            <Button>Actions</Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content placement={placement}>
            <DropdownMenu.Item id="new">New</DropdownMenu.Item>
            <DropdownMenu.Item id="open">Open</DropdownMenu.Item>
            <DropdownMenu.Item id="save">Save</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </FlexBox>
    );
  },
};

export const Open: Story = {
  render: function Render(args) {
    const [isOpen, { toggle, set }] = useBoolean(false);

    return (
      <FlexBox gap="m" alignItems="center" direction="column">
        <Button variant="fade-contrast-filled" onClick={toggle}>
          {isOpen ? 'Close' : 'Open'} the menu
        </Button>
        <DropdownMenu {...args} isOpen={isOpen} onOpenChange={set}>
          <DropdownMenu.Trigger>
            <Button>Actions</Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content>
            <DropdownMenu.Item id="new">New</DropdownMenu.Item>
            <DropdownMenu.Item id="open">Open</DropdownMenu.Item>
            <DropdownMenu.Item id="save">Save</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu>
      </FlexBox>
    );
  },
};

export const LongPress: Story = {
  render: (args) => (
    <DropdownMenu {...args} trigger="longPress">
      <DropdownMenu.Trigger>
        <Button>Press and hold</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content onAction={(key) => alert(key)}>
        <DropdownMenu.Item id="new">New</DropdownMenu.Item>
        <DropdownMenu.Item id="open">Open</DropdownMenu.Item>
        <DropdownMenu.Item id="save">Save</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  ),
};
