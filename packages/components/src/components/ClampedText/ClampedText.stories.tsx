import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { spacing } from '../layout';
import { Link } from '../Link';
import { Typography } from '../Typography';

import { ClampedText, type ClampedTextProps } from './index';

const meta = {
  title: 'Components/ClampedText',
  component: ClampedText,
  parameters: {
    layout: 'centered',
  },
  tags: ['status:new', 'date:2026-08-12'],
} satisfies Meta<typeof ClampedText>;

export default meta;
type Story = StoryObj<ClampedTextProps>;

export const Base: Story = {
  render: (args) => {
    const text =
      'In a distributed denial-of-service attack (DDoS attack), the incoming traffic flooding the victim originates from many different sources. More sophisticated strategies are required to mitigate this type of attack; simply attempting to block a single source is insufficient as there are multiple sources. A DoS or DDoS attack is analogous to a group of people crowding the entry door of a shop, making it hard for legitimate customers to enter, thus disrupting trade and losing the business money.';

    return (
      <ClampedText {...args} style={{ inlineSize: 320 }}>
        {text}
      </ClampedText>
    );
  },
};

export const Rows: Story = {
  render: (args) => {
    const text =
      'Long descriptions are easier to scan when secondary details can be collapsed. Set rows to control how much text remains visible before the user explicitly expands the rest of the content.';

    return (
      <ClampedText {...args} rows={2} style={{ inlineSize: 240 }}>
        {text}
      </ClampedText>
    );
  },
};

export const OneAdditionalRow: Story = {
  render: (args) => (
    <ClampedText {...args} rows={3} style={{ inlineSize: 320 }}>
      First visible row.
      <br />
      Second visible row.
      <br />
      Third visible row.
      <br />
      The only additional row is shown without a toggle.
    </ClampedText>
  ),
};

export const BlockContent: Story = {
  render: (args) => (
    <ClampedText {...args} rows={3} style={{ inlineSize: 320 }}>
      <Typography as="h3" variant="title" className={spacing({ pbe: 's' })}>
        Line clamp with block content
      </Typography>
      <Typography>
        ClampedText can measure and truncate text across semantic block
        elements. Typography variants remain attached to their respective
        elements while the shared container controls expansion. The{' '}
        <Link href="https://react.koobiq.io/" target="_blank" rel="noreferrer">
          documentation link
        </Link>{' '}
        is intentionally placed near the end to demonstrate how an interactive
        element behaves when it falls into the clamped part of the content.
      </Typography>
    </ClampedText>
  ),
};

export const ControlledExpansion: Story = {
  render: function Render(args) {
    const [isExpanded, setExpanded] = useState(false);

    const text =
      'Controlled expansion is useful when the state needs to be synchronized with another part of an application, such as a route parameter or a shared details panel. The component still recalculates whether clamping is necessary when its available width changes.';

    return (
      <ClampedText
        {...args}
        isExpanded={isExpanded}
        onExpandedChange={setExpanded}
        rows={2}
        style={{ inlineSize: 260 }}
      >
        {text}
      </ClampedText>
    );
  },
};

export const ResizePersistence: Story = {
  render: function Render(args) {
    const [width, setWidth] = useState(220);

    const text =
      'The expansion preference is preserved when resizing temporarily makes all of the text visible. Narrow the container again and the component restores the state selected before the resize.';

    return (
      <FlexBox direction="column" gap="m" alignItems="flex-start">
        <FlexBox gap="s">
          <Button onPress={() => setWidth(220)}>Narrow</Button>
          <Button onPress={() => setWidth(640)}>Wide</Button>
        </FlexBox>
        <ClampedText {...args} rows={2} style={{ inlineSize: width }}>
          {text}
        </ClampedText>
      </FlexBox>
    );
  },
};
