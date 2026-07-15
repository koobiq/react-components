import { useState } from 'react';

import {
  IconChevronDoubleLeftS16,
  IconChevronDoubleRightS16,
  IconCloud16,
  IconDashboard16,
  IconDatabase16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { IconButton } from '../IconButton';
import { Typography } from '../Typography';

import { Sidebar, type SidebarProps, sidebarPropPlacement } from './index.js';
import s from './Sidebar.stories.module.css';

const items = [
  { icon: <IconDashboard16 />, label: 'Dashboard' },
  { icon: <IconDatabase16 />, label: 'Storage' },
  { icon: <IconCloud16 />, label: 'Network' },
];

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placement: {
      options: sidebarPropPlacement,
      control: { type: 'inline-radio' },
    },
  },
  tags: ['status:new', 'date:2026-07-15'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<SidebarProps>;

const Panel = ({ onCollapse }: { onCollapse: () => void }) => (
  <div className={s.panel}>
    <IconButton
      variant="fade-contrast"
      aria-label="Collapse"
      onPress={onCollapse}
    >
      <IconChevronDoubleLeftS16 />
    </IconButton>
    {items.map(({ icon, label }) => (
      <div key={label} className={s.item}>
        {icon}
        <Typography variant="text-normal">{label}</Typography>
      </div>
    ))}
  </div>
);

const Compact = ({ onExpand }: { onExpand: () => void }) => (
  <div className={s.compact}>
    <IconButton variant="fade-contrast" aria-label="Expand" onPress={onExpand}>
      <IconChevronDoubleRightS16 />
    </IconButton>
    {items.map(({ icon, label }) => (
      <div key={label} className={s.item} title={label}>
        {icon}
      </div>
    ))}
  </div>
);

export const Base: Story = {
  render: (args) => (
    <div className={s.layout}>
      <Sidebar {...args} className={s.sidebar} defaultOpen>
        {({ isOpen, open, close }) =>
          isOpen ? <Panel onCollapse={close} /> : <Compact onExpand={open} />
        }
      </Sidebar>
      <div className={s.main}>
        <Typography variant="text-normal">
          Press <kbd>[</kbd> to toggle the sidebar.
        </Typography>
      </div>
    </div>
  ),
};

/**
 * Without `isOpen` the sidebar owns its state. `defaultOpen` sets the initial one —
 * it is closed by default.
 */
export const Uncontrolled: Story = {
  render: (args) => (
    <div className={s.layout}>
      <Sidebar {...args} className={s.sidebar}>
        {({ isOpen, open, close }) =>
          isOpen ? <Panel onCollapse={close} /> : <Compact onExpand={open} />
        }
      </Sidebar>
      <div className={s.main} />
    </div>
  ),
};

/**
 * Pass `isOpen` and `onOpenChange` to own the state. Note `onOpenChange` fires
 * immediately, while the render function keeps reporting the open state until the
 * collapse animation has finished.
 */
export const Controlled: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className={s.layout}>
        <Sidebar
          {...args}
          className={s.sidebar}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        >
          {({ isOpen: isOpenState, open, close }) =>
            isOpenState ? (
              <Panel onCollapse={close} />
            ) : (
              <Compact onExpand={open} />
            )
          }
        </Sidebar>
        <div className={s.main}>
          <Typography variant="text-normal">
            The sidebar is {isOpen ? 'open' : 'closed'}.
          </Typography>
        </div>
      </div>
    );
  },
};

/**
 * The render function is optional. Plain children stay mounted in both states and
 * are simply clipped by the box as it collapses.
 */
export const StaticContent: Story = {
  render: (args) => (
    <div className={s.layout}>
      <Sidebar {...args} className={s.sidebar} defaultOpen closedSize={56}>
        <div className={s.panel}>
          {items.map(({ icon, label }) => (
            <div key={label} className={s.item}>
              {icon}
              <Typography variant="text-normal">{label}</Typography>
            </div>
          ))}
        </div>
      </Sidebar>
      <div className={s.main}>
        <Typography variant="text-normal">Press [ to toggle.</Typography>
      </div>
    </div>
  ),
};

/** `size` and `closedSize` set the inline size of each state, in pixels. */
export const Sizing: Story = {
  render: (args) => (
    <div className={s.layout}>
      <Sidebar
        {...args}
        className={s.sidebar}
        defaultOpen
        size={320}
        closedSize={56}
      >
        {({ isOpen, open, close }) =>
          isOpen ? <Panel onCollapse={close} /> : <Compact onExpand={open} />
        }
      </Sidebar>
      <div className={s.main} />
    </div>
  ),
};

/**
 * `placement` anchors the content to its edge while the inline size animates, and
 * picks the shortcut: `[` toggles the `start` sidebar, `]` the `end` one.
 */
export const Placement: Story = {
  render: (args) => (
    <div className={s.layout}>
      <Sidebar {...args} className={s.sidebar} placement="start" defaultOpen>
        {({ isOpen, open, close }) =>
          isOpen ? <Panel onCollapse={close} /> : <Compact onExpand={open} />
        }
      </Sidebar>
      <div className={s.main}>
        <Typography variant="text-normal">
          <kbd>[</kbd> toggles the left sidebar, <kbd>]</kbd> the right one.
        </Typography>
      </div>
      <Sidebar {...args} className={s.sidebar} placement="end" defaultOpen>
        {({ isOpen, open, close }) =>
          isOpen ? <Panel onCollapse={close} /> : <Compact onExpand={open} />
        }
      </Sidebar>
    </div>
  ),
};

/**
 * `slotProps.transition` reaches the underlying transition. Its `onEntered` and
 * `onExited` fire once the animation has finished — that is the equivalent of the
 * Angular `stateChanged` output.
 */
export const CustomTransition: Story = {
  render: function Render(args) {
    const [log, setLog] = useState<string>('—');

    return (
      <div className={s.layout}>
        <Sidebar
          {...args}
          className={s.sidebar}
          defaultOpen
          slotProps={{
            transition: {
              onEntered: () => setLog('entered'),
              onExited: () => setLog('exited'),
            },
          }}
        >
          {({ isOpen, open, close }) =>
            isOpen ? <Panel onCollapse={close} /> : <Compact onExpand={open} />
          }
        </Sidebar>
        <div className={s.main}>
          <Typography variant="text-normal">Last transition: {log}</Typography>
        </div>
      </div>
    );
  },
};
