import { type CSSProperties, useState } from 'react';

import { IconBolt16, IconNorthEast16, IconStar16 } from '@koobiq/react-icons';
import * as Icons from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox } from '../Checkbox';
import { flex } from '../layout';
import { Typography } from '../Typography';

import type { LinkBaseProps } from './index.js';
import { Link } from './Link';

const mappingIcons = Object.entries(Icons).reduce((acc, [key, Icon]) => ({
  ...acc,
  [key]: <Icon />,
}));

const meta = {
  title: 'Components/Link',
  component: Link,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    startIcon: {
      options: Object.keys(Icons),
      mapping: mappingIcons,
      control: {
        type: 'select',
      },
    },
    endIcon: {
      options: Object.keys(Icons),
      mapping: mappingIcons,
      control: {
        type: 'select',
      },
    },
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args: LinkBaseProps) => (
    <Link href="#" {...args}>
      Link
    </Link>
  ),
};

export const Variant: Story = {
  render: () => (
    <div
      className={flex({
        gap: 'm',
        direction: 'column',
        alignItems: 'center',
      })}
    >
      <Link href="#" variant="text-compact">
        variant = text-compact
      </Link>
      <Link href="#" variant="text-normal">
        variant = text-normal
      </Link>
      <Link href="#" variant="text-big">
        variant = text-big
      </Link>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div
      className={flex({ gap: 'm', direction: 'column', alignItems: 'center' })}
    >
      <Link href="#" startIcon={<IconBolt16 />}>
        Link
      </Link>
      <Link href="#" startIcon={<IconStar16 />} endIcon={<IconStar16 />}>
        Link
      </Link>
      <Link
        href="https://react.koobiq.io/"
        target="_blank"
        rel="noreferrer"
        style={{ '--link-gap': 0 } as CSSProperties}
        endIcon={<IconNorthEast16 />}
      >
        External link
      </Link>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Link href="#" disabled>
      Link
    </Link>
  ),
};

export const Visitable: Story = {
  render: function Render() {
    const [visitable, setVisitable] = useState(true);

    return (
      <div className={flex({ gap: 'l', direction: 'column' })}>
        <Link href="https://react.koobiq.io/" visitable={visitable}>
          Link
        </Link>
        <Checkbox checked={visitable} onChange={setVisitable}>
          Visitable
        </Checkbox>
      </div>
    );
  },
};

export const RootTag: Story = {
  render: function Render() {
    const [disabled, setDisabled] = useState(false);
    const [pseudo, setPseudo] = useState(true);

    return (
      <div className={flex({ gap: 'l', direction: 'column' })}>
        <div className={flex({ gap: 'xl' })}>
          <Link
            as="button"
            onClick={() => alert("I'm a button")}
            disabled={disabled}
            pseudo={pseudo}
          >
            Button
          </Link>
          <Link
            as="span"
            onClick={() => alert("I'm a span")}
            disabled={disabled}
            pseudo={pseudo}
          >
            Pseudo-link
          </Link>
        </div>
        <div className={flex({ gap: 'xl' })}>
          <Checkbox checked={disabled} onChange={setDisabled}>
            Disabled
          </Checkbox>
          <Checkbox checked={pseudo} onChange={setPseudo}>
            Pseudo
          </Checkbox>
        </div>
      </div>
    );
  },
};

export const Composition: Story = {
  render: () => (
    <Typography variant="text-big-medium">
      Title with&nbsp;
      <Link href="#" variant="inherit">
        Link
      </Link>
    </Typography>
  ),
};
