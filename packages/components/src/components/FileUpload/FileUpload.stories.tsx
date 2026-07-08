import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { FileUpload } from './FileUpload';
import type { FileUploadItem } from './types';

const meta = {
  title: 'Components/FileUpload',
  component: FileUpload,
  subcomponents: {
    'FileUpload.Dropzone': FileUpload.Dropzone,
    'FileUpload.List': FileUpload.List,
    'FileUpload.Item': FileUpload.Item,
    'FileUpload.Trigger': FileUpload.Trigger,
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['status:new', 'date:2026-07-07'],
  decorators: [
    (Story) => (
      <div style={{ inlineSize: 420 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileUpload>;

export default meta;

type Story = StoryObj<typeof FileUpload>;

const makeItem = (name: string, size: number): FileUploadItem => ({
  id: name,
  size,
  file: new File(['stub'], name),
});

export const Base: Story = {
  render: (args) => (
    <FileUpload
      aria-label="Upload a file"
      size="compact"
      onChange={(items) => console.log(items)}
      {...args}
    />
  ),
};

export const SingleWithSelectedFile: Story = {
  render: (args) => (
    <FileUpload
      aria-label="Upload a file"
      showFileSize
      defaultValue={[makeItem('project_report_2023.docx', 148909)]}
      {...args}
    />
  ),
};

/**
 * In multiple mode the whole component is an active drop zone: drag files onto
 * it (or the "add more" strip) and they are appended to the list.
 */
export const Multiple: Story = {
  render: (args) => (
    <FileUpload
      allowsMultiple
      aria-label="Upload files"
      defaultValue={[
        makeItem('First.ext', 148909),
        makeItem('Second.ext', 148909),
        makeItem('Third.ext', 148909),
      ]}
      {...args}
    />
  ),
};

/**
 * The empty multiple state is a large drop area. Drop files anywhere on it or
 * use the browse link.
 */
export const MultipleEmpty: Story = {
  render: (args) => (
    <FileUpload allowsMultiple aria-label="Upload files" {...args} />
  ),
};

/** A long list scrolls within a capped height; the drop strip stays visible. */
export const Scrollable: Story = {
  name: 'Multiple (scrollable list)',
  render: (args) => (
    <FileUpload
      allowsMultiple
      showFileSize
      aria-label="Upload files"
      defaultValue={Array.from({ length: 8 }, (_, index) =>
        makeItem(`document_${index + 1}.pdf`, 148909 * (index + 1))
      )}
      {...args}
    />
  ),
};

export const Controlled: Story = {
  render: function Render(args) {
    const [items, setItems] = useState<FileUploadItem[]>([
      makeItem('notes_january.docx', 148909),
    ]);

    return (
      <FileUpload
        allowsMultiple
        aria-label="Upload files"
        value={items}
        onChange={setItems}
        {...args}
      />
    );
  },
};

export const Disabled: Story = {
  render: (args) => (
    <FileUpload
      isDisabled
      aria-label="Upload files"
      defaultValue={[makeItem('image_gallery.zip', 148909)]}
      {...args}
    />
  ),
};

/**
 * The same result as the default layout, but assembled explicitly from the
 * compound parts — this is the customization surface.
 */
export const Composition: Story = {
  name: 'Composition (compound parts)',
  render: (args) => (
    <FileUpload
      allowsMultiple
      showFileSize
      aria-label="Upload files"
      defaultValue={[
        makeItem('README.txt', 148909),
        makeItem('image.webp', 148909),
      ]}
      {...args}
    >
      <FileUpload.List />
      <FileUpload.Dropzone>
        Перетащите сюда или{' '}
        <FileUpload.Trigger>выберите файлы</FileUpload.Trigger>
      </FileUpload.Dropzone>
    </FileUpload>
  ),
};

/**
 * Custom dropzone content: replace the text and keep the browse trigger and the
 * drag hint (spec "Кастомный контент в загрузчике").
 */
export const CustomContent: Story = {
  render: (args) => (
    <FileUpload allowsMultiple aria-label="Upload files" {...args}>
      <FileUpload.Dropzone>
        <strong>Перетащите сюда ZIP-архивы с паролем</strong>
        <span>
          или <FileUpload.Trigger>выберите файлы</FileUpload.Trigger>
        </span>
      </FileUpload.Dropzone>
    </FileUpload>
  ),
};
