import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { FlexBox } from '../FlexBox';
import { Typography } from '../Typography';

import { Textarea, textareaPropVariant } from './index';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: (args) => (
    <Textarea
      label="Tell us your story"
      placeholder="Your story"
      defaultValue="It was a dark and stormy night..."
      {...args}
    />
  ),
};

export const Variant: Story = {
  render: function Render(args) {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        {textareaPropVariant.map((variant) => (
          <Textarea
            key={variant}
            variant={variant}
            aria-label="variant"
            placeholder={`variant = ${variant}`}
            {...args}
          />
        ))}
      </FlexBox>
    );
  },
};

export const Invalid: Story = {
  render: function Render(args) {
    return (
      <Textarea
        aria-label="error"
        placeholder="Placeholder"
        errorMessage="This field is required"
        isInvalid
        {...args}
      />
    );
  },
};

export const FullWidth: Story = {
  parameters: {
    layout: 'padded',
  },
  render: function Render(args) {
    return (
      <Textarea
        aria-label="fullWidth"
        placeholder="fullWidth"
        fullWidth
        {...args}
      />
    );
  },
};

export const Disabled: Story = {
  render: function Render(args) {
    return (
      <Textarea
        caption="disabled"
        aria-label="disabled"
        placeholder="Placeholder"
        isDisabled
        {...args}
      />
    );
  },
};

export const RowsCols: Story = {
  render: (args) => (
    <Textarea
      rows={5}
      cols={30}
      label="Tell us your story"
      placeholder="Your story"
      defaultValue="It was a dark and stormy night..."
      {...args}
    />
  ),
};

export const Expand: Story = {
  render: function Render(args) {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        <Textarea
          expand="vertical-resize"
          label="expand = vertical-resize"
          placeholder="Your story"
          defaultValue="It was a dark and stormy night..."
          fullWidth
          {...args}
        />
        <Textarea
          expand="auto-size"
          label="expand = auto-size"
          placeholder="Your story"
          defaultValue="It was a dark and stormy night..."
          fullWidth
          {...args}
        />
      </FlexBox>
    );
  },
};

export const Required: Story = {
  render: function Render(args) {
    return (
      <FlexBox gap="m" direction={{ xs: 'column', l: 'row' }}>
        <Textarea
          label="Tell us your story"
          caption="required"
          placeholder="Placeholder"
          isRequired
          {...args}
        />
        <Textarea
          label="Tell us your story"
          caption="required, without an indicator"
          placeholder="Placeholder"
          slotProps={{ label: { isRequired: false } }}
          isRequired
          {...args}
        />
      </FlexBox>
    );
  },
};

export const ReadOnly: Story = {
  render: function Render(args) {
    return (
      <Textarea
        label="Tell us your story"
        caption="read-only"
        placeholder="Your story"
        defaultValue="It was a dark and stormy night..."
        isReadOnly
        {...args}
      />
    );
  },
};

export const DefaultValue: Story = {
  render: function Render(args) {
    return (
      <Textarea
        label="Tell us your story"
        placeholder="Your story"
        defaultValue="It was a dark and stormy night..."
        {...args}
      />
    );
  },
};

export const ControlledValue: Story = {
  render: function Render(args) {
    const [value, setState] = useState('It was a dark and stormy night...');

    return (
      <FlexBox gap="m" direction="column" alignItems="stretch">
        <Textarea
          value={value}
          onChange={setState}
          placeholder="Your story"
          label="Tell us your story"
          fullWidth
          {...args}
        />
        <Typography ellipsis>Current value: {value}</Typography>
      </FlexBox>
    );
  },
};
