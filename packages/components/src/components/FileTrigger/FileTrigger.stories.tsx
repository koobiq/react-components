import { useRef, useState } from 'react';

import { IconPaperclip16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { IconButton } from '../IconButton';
import { Link } from '../Link';
import { Typography } from '../Typography';

import { FileTrigger } from './FileTrigger';
import type { FileTriggerProps, FileTriggerRef } from './types';

const meta = {
  title: 'Components/FileTrigger',
  component: FileTrigger,
  parameters: {
    layout: 'centered',
  },
  tags: ['status:new', 'date:2026-09-10'],
} satisfies Meta<typeof FileTrigger>;

export default meta;

type Story = StoryObj<FileTriggerProps>;

export const Base: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState<string[]>([]);

    const onSelect = (files: FileList | null) =>
      setSelected(Array.from(files ?? []).map((file) => file.name));

    return (
      <FlexBox direction="column" gap="s" alignItems="center">
        <FileTrigger {...args} onSelect={onSelect}>
          <Button>Choose a file</Button>
        </FileTrigger>
        <Typography variant="text-normal">
          {selected.join(', ') || 'Nothing selected'}
        </Typography>
      </FlexBox>
    );
  },
};

export const Multiple: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState<string[]>([]);

    const onSelect = (files: FileList | null) =>
      setSelected(Array.from(files ?? []).map((file) => file.name));

    return (
      <FlexBox direction="column" gap="s" alignItems="center">
        <FileTrigger {...args} allowsMultiple onSelect={onSelect}>
          <Button>Choose files</Button>
        </FileTrigger>
        <Typography variant="text-normal">
          {selected.join(', ') || 'Nothing selected'}
        </Typography>
      </FlexBox>
    );
  },
};

export const Accept: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState<string[]>([]);

    const onSelect = (files: FileList | null) =>
      setSelected(Array.from(files ?? []).map((file) => file.name));

    return (
      <FlexBox direction="column" gap="s" alignItems="center">
        <FileTrigger
          {...args}
          allowsMultiple
          accept={['image/*', '.pdf']}
          onSelect={onSelect}
        >
          <Button>Choose an image or a PDF</Button>
        </FileTrigger>
        <Typography variant="text-normal">
          {selected.join(', ') || 'Nothing selected'}
        </Typography>
      </FlexBox>
    );
  },
};

export const Directory: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState<string[]>([]);

    const onSelect = (files: FileList | null) =>
      setSelected(
        Array.from(files ?? []).map((file) => file.webkitRelativePath)
      );

    return (
      <FlexBox direction="column" gap="s" alignItems="center">
        <FileTrigger {...args} acceptDirectory onSelect={onSelect}>
          <Button>Choose a folder</Button>
        </FileTrigger>
        <Typography variant="text-normal">
          {selected.join(', ') || 'Nothing selected'}
        </Typography>
      </FlexBox>
    );
  },
};

export const Camera: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState<string[]>([]);

    const onSelect = (files: FileList | null) =>
      setSelected(Array.from(files ?? []).map((file) => file.name));

    return (
      <FlexBox direction="column" gap="s" alignItems="center">
        <FileTrigger
          {...args}
          accept={['image/*']}
          defaultCamera="environment"
          onSelect={onSelect}
        >
          <Button>Take a photo</Button>
        </FileTrigger>
        <Typography variant="text-normal">
          {selected.join(', ') || 'Nothing selected'}
        </Typography>
      </FlexBox>
    );
  },
};

export const Disabled: Story = {
  render: (args) => (
    <FileTrigger {...args}>
      <Button isDisabled>Choose a file</Button>
    </FileTrigger>
  ),
};

export const Triggers: Story = {
  render: function Render(args) {
    const [selected, setSelected] = useState<string[]>([]);

    const onSelect = (files: FileList | null) =>
      setSelected(Array.from(files ?? []).map((file) => file.name));

    return (
      <FlexBox direction="column" gap="s" alignItems="center">
        <FlexBox gap="s" alignItems="center">
          <FileTrigger {...args} onSelect={onSelect}>
            <IconButton aria-label="Attach a file">
              <IconPaperclip16 />
            </IconButton>
          </FileTrigger>
          <FileTrigger {...args} onSelect={onSelect}>
            <Link isPseudo>Attach a file</Link>
          </FileTrigger>
        </FlexBox>
        <Typography variant="text-normal">
          {selected.join(', ') || 'Nothing selected'}
        </Typography>
      </FlexBox>
    );
  },
};

export const ProgrammaticOpen: Story = {
  render: function Render(args) {
    const inputRef = useRef<FileTriggerRef>(null);

    const [selected, setSelected] = useState<string[]>([]);

    const onSelect = (files: FileList | null) =>
      setSelected(Array.from(files ?? []).map((file) => file.name));

    return (
      <FlexBox direction="column" gap="s" alignItems="center">
        <FlexBox gap="s">
          <FileTrigger {...args} ref={inputRef} onSelect={onSelect}>
            <Button>Choose a file</Button>
          </FileTrigger>
          <Button
            variant="fade-contrast-filled"
            onPress={() => inputRef.current?.click()}
          >
            Open from elsewhere
          </Button>
        </FlexBox>
        <Typography variant="text-normal">
          {selected.join(', ') || 'Nothing selected'}
        </Typography>
      </FlexBox>
    );
  },
};
