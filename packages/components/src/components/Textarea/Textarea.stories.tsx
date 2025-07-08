import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { flex } from '../layout';
import { useBreakpoints } from '../Provider';
import { Typography } from '../Typography';

import { Textarea, type TextareaProps, textareaPropVariant } from './index';

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
  render: (args: TextareaProps) => (
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
    const { l } = useBreakpoints();

    return (
      <div className={flex({ gap: 'm', direction: l ? 'row' : 'column' })}>
        {textareaPropVariant.map((variant) => (
          <Textarea
            key={variant}
            variant={variant}
            aria-label="variant"
            placeholder={`variant = ${variant}`}
            {...args}
          />
        ))}
      </div>
    );
  },
};

export const Invalid: Story = {
  render: function Render(args: TextareaProps) {
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
  render: function Render(args: TextareaProps) {
    const { l } = useBreakpoints();

    return (
      <div style={{ inlineSize: l ? 320 : 260 }}>
        <Textarea
          aria-label="fullWidth"
          placeholder="fullWidth"
          fullWidth
          {...args}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: function Render(args: TextareaProps) {
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
  render: (args: TextareaProps) => (
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
  render: function Render(args: TextareaProps) {
    const { l } = useBreakpoints();

    return (
      <div className={flex({ gap: 'm', direction: l ? 'row' : 'column' })}>
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
      </div>
    );
  },
};

export const Required: Story = {
  render: function Render(args: TextareaProps) {
    const { l } = useBreakpoints();

    return (
      <div className={flex({ gap: 'm', direction: l ? 'row' : 'column' })}>
        <Textarea
          label="Tell us your story"
          caption="required"
          placeholder="Placeholder"
          isRequired
          {...args}
        />
        <Textarea
          label="Tell us your story"
          caption="required, without indicator"
          placeholder="Placeholder"
          slotProps={{ label: { isRequired: false } }}
          isRequired
          {...args}
        />
      </div>
    );
  },
};

export const ReadOnly: Story = {
  render: function Render(args: TextareaProps) {
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
  render: function Render(args: TextareaProps) {
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
  render: function Render(args: TextareaProps) {
    const [value, setState] = useState('It was a dark and stormy night...');

    return (
      <div
        className={flex({
          gap: 'm',
          direction: 'column',
          alignItems: 'stretch',
        })}
      >
        <Textarea
          value={value}
          onChange={setState}
          placeholder="Your story"
          label="Tell us your story"
          fullWidth
          {...args}
        />
        <Typography ellipsis>Current value: {value}</Typography>
      </div>
    );
  },
};
