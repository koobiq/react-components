import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { Typography } from '../Typography';

import { SearchExpandable } from './index';
import type { SearchExpandableProps } from './index';

const meta = {
  title: 'Components/SearchExpandable',
  component: SearchExpandable,
  parameters: { layout: 'centered' },
  tags: ['status:new', 'date:2026-11-11'],
} satisfies Meta<typeof SearchExpandable>;

export default meta;

type Story = StoryObj<SearchExpandableProps>;

export const Base: Story = {
  render: (args) => <SearchExpandable {...args} />,
};

export const Controlled: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    return (
      <FlexBox gap="m" direction="column">
        <SearchExpandable
          {...args}
          value={value}
          onChange={setValue}
          isOpen={isOpen}
          onOpenChange={setIsOpen}
        />
        <Typography>Committed value: {value || '—'}</Typography>
      </FlexBox>
    );
  },
};

export const Debounce: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('');

    return (
      <FlexBox gap="m" direction="column">
        <SearchExpandable
          {...args}
          emitValueTimeout={1000}
          onChange={setValue}
        />
        <Typography>Committed value: {value || '—'}</Typography>
      </FlexBox>
    );
  },
};

export const EnterMode: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('');

    return (
      <FlexBox gap="m" direction="column">
        <SearchExpandable
          {...args}
          isEmitValueByEnterEnabled
          onChange={setValue}
        />
        <Typography>Committed value: {value || '—'}</Typography>
      </FlexBox>
    );
  },
};

export const Disabled: Story = {
  render: (args) => (
    <FlexBox gap="l" direction={{ xs: 'column', l: 'row' }}>
      <SearchExpandable {...args} isDisabled />
      <SearchExpandable {...args} isDisabled defaultOpen />
    </FlexBox>
  ),
};

export const CustomLabels: Story = {
  render: (args) => (
    <FlexBox gap="l" direction={{ xs: 'column', l: 'row' }}>
      <SearchExpandable
        {...args}
        tooltipText="Find in table"
        slotProps={{ closeButton: { 'aria-label': 'Dismiss search' } }}
      />
      <SearchExpandable
        {...args}
        defaultOpen
        placeholder="Find a row"
        slotProps={{ closeButton: { 'aria-label': 'Dismiss search' } }}
      />
    </FlexBox>
  ),
};
