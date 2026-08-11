import type { CSSProperties } from 'react';
import { useState } from 'react';

import { useBoolean } from '@koobiq/react-core';
import {
  IconAlignCenter16,
  IconAlignLeft16,
  IconAlignRight16,
  IconArrowRightToBracket16,
  IconBell16,
  IconFileMultipleO16,
  IconDashboard16,
  IconGear16,
  IconMessage16,
  IconPlus16,
  IconScissors16,
  IconTextBold16,
  IconTextItalic16,
  IconTextUnderline16,
  IconTrash16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import type { Selection } from '../../index';
import { Button } from '../Button';
import { Divider } from '../Divider';
import { FlexBox } from '../FlexBox';
import { spacing } from '../layout';
import { SearchInput } from '../SearchInput';
import { SelectNext as Select } from '../SelectNext';
import { Typography } from '../Typography';

import avatar from './__stories__/avatar.webp';
import { DropdownMenu } from './DropdownMenu';
import type { DropdownMenuProps, DropdownMenuPropPlacement } from './index';
import { dropdownMenuPropPlacement } from './index';

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  subcomponents: {
    'DropdownMenu.Popover': DropdownMenu.Popover,
    'DropdownMenu.Content': DropdownMenu.Content,
    'DropdownMenu.Item': DropdownMenu.Item,
    'DropdownMenu.ItemText': DropdownMenu.ItemText,
    'DropdownMenu.ItemAddon': DropdownMenu.ItemAddon,
    'DropdownMenu.Section': DropdownMenu.Section,
    'DropdownMenu.Header': DropdownMenu.Header,
    'DropdownMenu.SubmenuTrigger': DropdownMenu.SubmenuTrigger,
    'DropdownMenu.Autocomplete': DropdownMenu.Autocomplete,
    'DropdownMenu.Footer': DropdownMenu.Footer,
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
      <Button>Actions</Button>
      <DropdownMenu.Popover>
        <DropdownMenu.Content onAction={(key) => alert(key)}>
          <DropdownMenu.Item id="new">New</DropdownMenu.Item>
          <DropdownMenu.Item id="open">Open</DropdownMenu.Item>
          <DropdownMenu.Item id="save">Save</DropdownMenu.Item>
          <DropdownMenu.Item id="duplicate">Duplicate</DropdownMenu.Item>
          <DropdownMenu.Item id="rename">Rename</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Popover>
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
        <Button>Actions</Button>
        <DropdownMenu.Popover>
          <DropdownMenu.Content items={items} onAction={(key) => alert(key)}>
            {(item: (typeof items)[number]) => (
              <DropdownMenu.Item>{item.name}</DropdownMenu.Item>
            )}
          </DropdownMenu.Content>
        </DropdownMenu.Popover>
      </DropdownMenu>
    );
  },
};

export const ItemContent: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <Button>Edit</Button>
      <DropdownMenu.Popover>
        <DropdownMenu.Content onAction={(key) => alert(key)}>
          <DropdownMenu.Item id="copy" align="start" textValue="Copy">
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
          <DropdownMenu.Item id="cut" align="start" textValue="Cut">
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
          <DropdownMenu.Item id="delete" align="start" textValue="Delete">
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
      </DropdownMenu.Popover>
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
        <Button>Text size</Button>
        <DropdownMenu.Popover>
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
        </DropdownMenu.Popover>
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
        <Button>View</Button>
        <DropdownMenu.Popover>
          <DropdownMenu.Content
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            <DropdownMenu.Item id="sidebar">Sidebar</DropdownMenu.Item>
            <DropdownMenu.Item id="searchbar">Search bar</DropdownMenu.Item>
            <DropdownMenu.Item id="console">Console</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Popover>
      </DropdownMenu>
    );
  },
};

export const DisabledItems: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <Button>Actions</Button>
      <DropdownMenu.Popover>
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
      </DropdownMenu.Popover>
    </DropdownMenu>
  ),
};

export const Links: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <Button>Links</Button>
      <DropdownMenu.Popover>
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
      </DropdownMenu.Popover>
    </DropdownMenu>
  ),
};

export const Sections: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <Button>Actions</Button>
      <DropdownMenu.Popover>
        <DropdownMenu.Content onAction={(key) => alert(key)}>
          <DropdownMenu.Section title="File">
            <DropdownMenu.Item id="new">New</DropdownMenu.Item>
            <DropdownMenu.Item id="open">Open</DropdownMenu.Item>
          </DropdownMenu.Section>
          <Divider />
          <DropdownMenu.Section title="Edit">
            <DropdownMenu.Item id="copy">Copy</DropdownMenu.Item>
            <DropdownMenu.Item id="cut">Cut</DropdownMenu.Item>
            <DropdownMenu.Item id="paste">Paste</DropdownMenu.Item>
          </DropdownMenu.Section>
        </DropdownMenu.Content>
      </DropdownMenu.Popover>
    </DropdownMenu>
  ),
};

export const SectionsDynamic: Story = {
  render: function Render(args) {
    // A separator is its own entry: the collection expects one node per item.
    const sections = [
      {
        id: 'file',
        name: 'File',
        children: [
          { id: 'new', name: 'New' },
          { id: 'open', name: 'Open' },
        ],
      },
      { id: 'file-separator' },
      {
        id: 'edit',
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
        <Button>Actions</Button>
        <DropdownMenu.Popover>
          <DropdownMenu.Content items={sections} onAction={(key) => alert(key)}>
            {(section: (typeof sections)[number]) =>
              'children' in section ? (
                <DropdownMenu.Section
                  title={section.name}
                  items={section.children}
                >
                  {(item: { id: string; name: string }) => (
                    <DropdownMenu.Item>{item.name}</DropdownMenu.Item>
                  )}
                </DropdownMenu.Section>
              ) : (
                <Divider />
              )
            }
          </DropdownMenu.Content>
        </DropdownMenu.Popover>
      </DropdownMenu>
    );
  },
};

export const WithSectionLevelSelection: Story = {
  render: function Render(args) {
    const [style, setStyle] = useState<Selection>(new Set(['bold', 'italic']));
    const [align, setAlign] = useState<Selection>(new Set(['left']));

    return (
      <DropdownMenu {...args}>
        <Button>Styles</Button>
        <DropdownMenu.Popover>
          <DropdownMenu.Content>
            <DropdownMenu.Section title="Actions">
              <DropdownMenu.Item id="cut" textValue="Cut">
                <DropdownMenu.ItemAddon>
                  <IconScissors16 />
                </DropdownMenu.ItemAddon>
                <DropdownMenu.ItemText>Cut</DropdownMenu.ItemText>
                <DropdownMenu.ItemAddon>
                  <Typography color="contrast-tertiary" variant="text-compact">
                    ⌘X
                  </Typography>
                </DropdownMenu.ItemAddon>
              </DropdownMenu.Item>
              <DropdownMenu.Item id="copy" textValue="Copy">
                <DropdownMenu.ItemAddon>
                  <IconFileMultipleO16 />
                </DropdownMenu.ItemAddon>
                <DropdownMenu.ItemText>Copy</DropdownMenu.ItemText>
                <DropdownMenu.ItemAddon>
                  <Typography color="contrast-tertiary" variant="text-compact">
                    ⌘C
                  </Typography>
                </DropdownMenu.ItemAddon>
              </DropdownMenu.Item>
            </DropdownMenu.Section>
            <Divider />
            <DropdownMenu.Section
              title="Text style"
              selectionMode="multiple"
              selectedKeys={style}
              onSelectionChange={setStyle}
            >
              <DropdownMenu.Item id="bold" textValue="Bold">
                <DropdownMenu.ItemAddon>
                  <IconTextBold16 />
                </DropdownMenu.ItemAddon>
                <DropdownMenu.ItemText>Bold</DropdownMenu.ItemText>
              </DropdownMenu.Item>
              <DropdownMenu.Item id="italic" textValue="Italic">
                <DropdownMenu.ItemAddon>
                  <IconTextItalic16 />
                </DropdownMenu.ItemAddon>
                <DropdownMenu.ItemText>Italic</DropdownMenu.ItemText>
              </DropdownMenu.Item>
              <DropdownMenu.Item id="underline" textValue="Underline">
                <DropdownMenu.ItemAddon>
                  <IconTextUnderline16 />
                </DropdownMenu.ItemAddon>
                <DropdownMenu.ItemText>Underline</DropdownMenu.ItemText>
              </DropdownMenu.Item>
            </DropdownMenu.Section>
            <Divider />
            <DropdownMenu.Section
              title="Text alignment"
              selectionMode="single"
              selectedKeys={align}
              onSelectionChange={setAlign}
              disallowEmptySelection
            >
              <DropdownMenu.Item id="left" textValue="Left">
                <DropdownMenu.ItemAddon>
                  <IconAlignLeft16 />
                </DropdownMenu.ItemAddon>
                <DropdownMenu.ItemText>Left</DropdownMenu.ItemText>
              </DropdownMenu.Item>
              <DropdownMenu.Item id="center" textValue="Center">
                <DropdownMenu.ItemAddon>
                  <IconAlignCenter16 />
                </DropdownMenu.ItemAddon>
                <DropdownMenu.ItemText>Center</DropdownMenu.ItemText>
              </DropdownMenu.Item>
              <DropdownMenu.Item id="right" textValue="Right">
                <DropdownMenu.ItemAddon>
                  <IconAlignRight16 />
                </DropdownMenu.ItemAddon>
                <DropdownMenu.ItemText>Right</DropdownMenu.ItemText>
              </DropdownMenu.Item>
            </DropdownMenu.Section>
          </DropdownMenu.Content>
        </DropdownMenu.Popover>
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
        <DropdownMenu.Pressable>
          <div role="button" style={buttonStyle}>
            <img src={avatar} alt="Sophia Bellmont" style={imgStyle} />
          </div>
        </DropdownMenu.Pressable>
        <DropdownMenu.Popover>
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
            <Divider />
            <DropdownMenu.Item id="dashboard" textValue="Dashboard">
              <DropdownMenu.ItemAddon>
                <IconDashboard16 />
              </DropdownMenu.ItemAddon>
              <DropdownMenu.ItemText>Dashboard</DropdownMenu.ItemText>
            </DropdownMenu.Item>
            <DropdownMenu.Item id="notifications" textValue="Notifications">
              <DropdownMenu.ItemAddon>
                <IconBell16 />
              </DropdownMenu.ItemAddon>
              <DropdownMenu.ItemText>Notifications</DropdownMenu.ItemText>
            </DropdownMenu.Item>
            <DropdownMenu.Item id="create-team" textValue="Create team">
              <DropdownMenu.ItemAddon>
                <IconPlus16 />
              </DropdownMenu.ItemAddon>
              <DropdownMenu.ItemText>Create team</DropdownMenu.ItemText>
            </DropdownMenu.Item>
            <DropdownMenu.Item id="settings" textValue="Settings">
              <DropdownMenu.ItemAddon>
                <IconGear16 />
              </DropdownMenu.ItemAddon>
              <DropdownMenu.ItemText>Settings</DropdownMenu.ItemText>
            </DropdownMenu.Item>
            <Divider />
            <DropdownMenu.Item id="support" textValue="Contact support">
              <DropdownMenu.ItemAddon>
                <IconMessage16 />
              </DropdownMenu.ItemAddon>
              <DropdownMenu.ItemText>Contact support</DropdownMenu.ItemText>
            </DropdownMenu.Item>
            <Divider />
            <DropdownMenu.Item id="logout" textValue="Log out">
              <DropdownMenu.ItemAddon>
                <IconArrowRightToBracket16 />
              </DropdownMenu.ItemAddon>
              <DropdownMenu.ItemText>Log out</DropdownMenu.ItemText>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Popover>
      </DropdownMenu>
    );
  },
};

export const Submenu: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <Button>Actions</Button>
      <DropdownMenu.Popover>
        <DropdownMenu.Content onAction={(key) => alert(key)}>
          <DropdownMenu.Item id="new">New</DropdownMenu.Item>
          <DropdownMenu.Item id="rename">Rename</DropdownMenu.Item>
          <DropdownMenu.SubmenuTrigger>
            <DropdownMenu.Item id="share">Share</DropdownMenu.Item>
            <DropdownMenu.Popover>
              <DropdownMenu.Content onAction={(key) => alert(key)}>
                <DropdownMenu.Item id="email">Email</DropdownMenu.Item>
                <DropdownMenu.Item id="sms">SMS</DropdownMenu.Item>
                <DropdownMenu.SubmenuTrigger>
                  <DropdownMenu.Item id="messengers">
                    Messengers
                  </DropdownMenu.Item>
                  <DropdownMenu.Popover>
                    <DropdownMenu.Content onAction={(key) => alert(key)}>
                      <DropdownMenu.Item id="telegram">
                        Telegram
                      </DropdownMenu.Item>
                      <DropdownMenu.Item id="signal">Signal</DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Popover>
                </DropdownMenu.SubmenuTrigger>
              </DropdownMenu.Content>
            </DropdownMenu.Popover>
          </DropdownMenu.SubmenuTrigger>
          <Divider />
          <DropdownMenu.Item id="delete">Delete</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Popover>
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
        <Button>Cities</Button>
        <DropdownMenu.Popover>
          <DropdownMenu.Autocomplete>
            <SearchInput />
            <Divider disablePaddings />
            <DropdownMenu.Content onAction={(key) => alert(key)}>
              {items.map((item) => (
                <DropdownMenu.Item key={item} id={item}>
                  {item}
                </DropdownMenu.Item>
              ))}
              <DropdownMenu.SubmenuTrigger>
                <DropdownMenu.Item id="other">Other cities</DropdownMenu.Item>
                <DropdownMenu.Popover>
                  <DropdownMenu.Content onAction={(key) => alert(key)}>
                    <DropdownMenu.Item id="tallinn">Tallinn</DropdownMenu.Item>
                    <DropdownMenu.Item id="vilnius">Vilnius</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Popover>
              </DropdownMenu.SubmenuTrigger>
            </DropdownMenu.Content>
          </DropdownMenu.Autocomplete>
        </DropdownMenu.Popover>
      </DropdownMenu>
    );
  },
};

export const SearchEmpty: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <Button>Actions</Button>
      <DropdownMenu.Popover>
        <DropdownMenu.Autocomplete>
          <SearchInput />
          <Divider disablePaddings />
          <DropdownMenu.Content noItemsText="No such action">
            <DropdownMenu.Item id="new">New</DropdownMenu.Item>
            <DropdownMenu.Item id="open">Open</DropdownMenu.Item>
            <DropdownMenu.Item id="save">Save</DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Autocomplete>
      </DropdownMenu.Popover>
    </DropdownMenu>
  ),
};

export const DropdownFooter: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <Button>Actions</Button>
      <DropdownMenu.Popover>
        <DropdownMenu.Content>
          <DropdownMenu.Item id="new">New</DropdownMenu.Item>
          <DropdownMenu.Item id="open">Open</DropdownMenu.Item>
          <DropdownMenu.Item id="save">Save</DropdownMenu.Item>
        </DropdownMenu.Content>
        <DropdownMenu.Footer>
          The text in the footer of the drop-down list.
        </DropdownMenu.Footer>
      </DropdownMenu.Popover>
    </DropdownMenu>
  ),
};

export const Placement: Story = {
  render: function Render(args) {
    const [placement, setPlacement] =
      useState<DropdownMenuPropPlacement>('bottom start');

    return (
      <FlexBox gap="m" alignItems="center" direction="column">
        <Select
          value={placement}
          label="Placement"
          style={{ inlineSize: 200 }}
          onChange={(value) => setPlacement(value as DropdownMenuPropPlacement)}
        >
          {dropdownMenuPropPlacement.map((item) => (
            <Select.Item key={item} id={item}>
              {item}
            </Select.Item>
          ))}
        </Select>
        <DropdownMenu {...args}>
          <Button>Actions</Button>
          <DropdownMenu.Popover placement={placement}>
            <DropdownMenu.Content>
              <DropdownMenu.Item id="new">New</DropdownMenu.Item>
              <DropdownMenu.Item id="open">Open</DropdownMenu.Item>
              <DropdownMenu.Item id="save">Save</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Popover>
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
          <Button>Actions</Button>
          <DropdownMenu.Popover>
            <DropdownMenu.Content>
              <DropdownMenu.Item id="new">New</DropdownMenu.Item>
              <DropdownMenu.Item id="open">Open</DropdownMenu.Item>
              <DropdownMenu.Item id="save">Save</DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Popover>
        </DropdownMenu>
      </FlexBox>
    );
  },
};

export const LongPress: Story = {
  render: (args) => (
    <DropdownMenu {...args} trigger="longPress">
      <Button>Press and hold</Button>
      <DropdownMenu.Popover>
        <DropdownMenu.Content onAction={(key) => alert(key)}>
          <DropdownMenu.Item id="new">New</DropdownMenu.Item>
          <DropdownMenu.Item id="open">Open</DropdownMenu.Item>
          <DropdownMenu.Item id="save">Save</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Popover>
    </DropdownMenu>
  ),
};
