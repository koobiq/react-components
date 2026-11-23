import type { CSSProperties } from 'react';
import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { InlineEdit, type InlineEditProps } from '../index';
import { Input } from '../Input';
import { Textarea as TextareaComponent } from '../Textarea';

const meta = {
  title: 'Components/InlineEdit',
  component: InlineEdit,
  subcomponents: {
    'InlineEdit.Placeholder': InlineEdit.Placeholder,
  },
  tags: ['status:new', 'date:2026-11-20'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof InlineEdit>;

export default meta;
type Story = StoryObj<InlineEditProps<string>>;

export const Controlled: Story = {
  render: function Render() {
    const [name, setName] = useState('Security team');

    return (
      <div style={{ inlineSize: 320 }}>
        <InlineEdit
          aria-label="Name"
          label="Name"
          value={name}
          onChange={setName}
          renderView={(value) =>
            value || <InlineEdit.Placeholder>Not filled</InlineEdit.Placeholder>
          }
          renderEdit={({ value, onChange }) => (
            <Input
              aria-label="Name"
              value={value}
              onChange={onChange}
              fullWidth
            />
          )}
        />
      </div>
    );
  },
};

export const Uncontrolled: Story = {
  render: () => (
    <div style={{ inlineSize: 320 }}>
      <InlineEdit
        aria-label="Name"
        label="Name"
        defaultValue="Security team"
        renderView={(value) => value}
        renderEdit={({ value, onChange }) => (
          <Input
            aria-label="Name"
            value={value}
            onChange={onChange}
            fullWidth
          />
        )}
      />
    </div>
  ),
};

export const WithoutLabel: Story = {
  render: () => (
    <div style={{ inlineSize: 320 }}>
      <InlineEdit
        aria-label="Description"
        defaultValue="Monitors incidents"
        renderView={(value) => value}
        renderEdit={({ value, onChange }) => (
          <Input
            aria-label="Description"
            value={value}
            onChange={onChange}
            fullWidth
          />
        )}
      />
    </div>
  ),
};

export const Placeholder: Story = {
  render: () => (
    <div style={{ inlineSize: 320 }}>
      <InlineEdit
        aria-label="Owner"
        label="Owner"
        defaultValue=""
        renderView={() => (
          <InlineEdit.Placeholder>Not assigned</InlineEdit.Placeholder>
        )}
        renderEdit={({ value, onChange }) => (
          <Input
            aria-label="Owner"
            value={value}
            onChange={onChange}
            fullWidth
          />
        )}
      />
    </div>
  ),
};

export const Textarea: Story = {
  render: function Render() {
    const [description, setDescription] = useState('Monitors incidents');

    return (
      <FlexBox direction="column" gap="s" style={{ inlineSize: 320 }}>
        <InlineEdit
          aria-label="Description"
          label="Description"
          value={description}
          onChange={setDescription}
          renderView={(value) => value}
          renderEdit={({ value, onChange }) => (
            <TextareaComponent
              aria-label="Description"
              value={value}
              onChange={onChange}
              fullWidth
            />
          )}
        />
        <span>Press Ctrl/Cmd+Enter to save.</span>
      </FlexBox>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ inlineSize: 320 }}>
      <InlineEdit
        aria-label="Name"
        label="Name"
        defaultValue="Security team"
        isDisabled
        renderView={(value) => value}
        renderEdit={({ value, onChange }) => (
          <Input
            aria-label="Name"
            value={value}
            onChange={onChange}
            fullWidth
          />
        )}
      />
    </div>
  ),
};

export const FixedWidth: Story = {
  render: () => (
    <FlexBox direction="column" gap="m">
      <div style={{ inlineSize: 240 }}>
        <InlineEdit
          aria-label="Default width"
          label="Default width"
          defaultValue="Security team"
          renderView={(value) => value}
          renderEdit={({ value, onChange }) => (
            <Input
              aria-label="Default width"
              value={value}
              onChange={onChange}
              fullWidth
            />
          )}
        />
      </div>
      <div style={{ inlineSize: 240 }}>
        <InlineEdit
          aria-label="Fixed width"
          label="Fixed width"
          defaultValue="Security team"
          editModeWidth={400}
          renderView={(value) => value}
          renderEdit={({ value, onChange }) => (
            <Input
              aria-label="Fixed width"
              value={value}
              onChange={onChange}
              fullWidth
            />
          )}
        />
      </div>
    </FlexBox>
  ),
};

export const ProgrammaticMode: Story = {
  render: function Render() {
    const [mode, setMode] = useState<'view' | 'edit'>('view');

    return (
      <FlexBox direction="column" gap="m" style={{ inlineSize: 320 }}>
        <FlexBox gap="s">
          <Button onPress={() => setMode('edit')}>Edit</Button>
          <Button onPress={() => setMode('view')}>Close</Button>
        </FlexBox>
        <InlineEdit
          aria-label="Name"
          label="Name"
          mode={mode}
          onModeChange={setMode}
          defaultValue="Security team"
          renderView={(value) => value}
          renderEdit={({ value, onChange }) => (
            <Input
              aria-label="Name"
              value={value}
              onChange={onChange}
              fullWidth
            />
          )}
        />
      </FlexBox>
    );
  },
};

export const CustomDesign: Story = {
  render: () => {
    const style = {
      inlineSize: 320,
      '--kbq-inline-edit-height': '48px',
      '--kbq-inline-edit-background':
        'var(--kbq-states-background-transparent-hover)',
      '--kbq-inline-edit-label-color': 'var(--kbq-foreground-theme)',
    } as CSSProperties;

    return (
      <InlineEdit
        aria-label="Name"
        label="Name"
        defaultValue="Security team"
        style={style}
        renderView={(value) => value}
        renderEdit={({ value, onChange }) => (
          <Input
            aria-label="Name"
            value={value}
            onChange={onChange}
            fullWidth
          />
        )}
      />
    );
  },
};
