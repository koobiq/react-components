import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { FlexBox } from '../FlexBox';
import { spacing } from '../layout';
import { Toggle } from '../Toggle';
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

const text =
  'In a distributed denial-of-service attack (DDoS attack), the incoming traffic flooding the victim originates from many different sources. More sophisticated strategies are required to mitigate this type of attack; simply attempting to block a single source is insufficient as there are multiple sources. A DoS or DDoS attack is analogous to a group of people crowding the entry door of a shop, making it hard for legitimate customers to enter, thus disrupting trade and losing the business money. Criminal perpetrators of DoS attacks often target sites or services hosted on high-profile web servers such as banks or credit card payment gateways. Revenge and blackmail, as well as hacktivism, can motivate these attacks.';

export const Base: Story = {
  render: (args) => {
    return <ClampedText {...args}>{text}</ClampedText>;
  },
};

export const Rows: Story = {
  render: (args) => {
    return (
      <ClampedText rows={2} {...args}>
        {text}
      </ClampedText>
    );
  },
};

export const StructuredContent: Story = {
  render: (args) => (
    <ClampedText {...args} rows={3}>
      <Typography as="h3" variant="title" className={spacing({ pbe: 's' })}>
        Line clamp with structured content
      </Typography>
      <Typography>{text}</Typography>
    </ClampedText>
  ),
};

export const ControlledExpansion: Story = {
  render: function Render(args) {
    const [isExpanded, setExpanded] = useState(false);

    return (
      <ClampedText
        {...args}
        isExpanded={isExpanded}
        onExpandedChange={setExpanded}
        rows={2}
      >
        {text}
      </ClampedText>
    );
  },
};

export const ResizePersistence: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render(args) {
    const [isNarrow, setNarrow] = useState(false);

    const text =
      'The expansion preference is preserved when resizing temporarily makes all of the text visible. Narrow the container again and the component restores the state selected before the resize.';

    return (
      <FlexBox
        direction="column"
        gap="m"
        alignItems="flex-start"
        style={{ inlineSize: '100%' }}
      >
        <Toggle isSelected={isNarrow} onChange={setNarrow}>
          Narrow
        </Toggle>
        <ClampedText
          {...args}
          rows={2}
          style={{ inlineSize: isNarrow ? 200 : '100%' }}
        >
          {text}
        </ClampedText>
      </FlexBox>
    );
  },
};

export const Customization: Story = {
  render: (args) => {
    return (
      <ClampedText
        {...args}
        rows={2}
        id="custom-clamped-text"
        moreText="Show details"
        lessText="Hide details"
        slotProps={{
          content: {
            id: 'custom-clamped-text-content',
            'data-testid': 'custom-content',
          },
          toggle: {
            'data-testid': 'custom-toggle',
            style: { alignSelf: 'flex-end' },
          },
        }}
      >
        {text}
      </ClampedText>
    );
  },
};
