import { useState } from 'react';

import type { Meta, StoryObj } from '@storybook/react-vite';

import { FileUpload } from './FileUpload';
import type { FileUploadFile } from './types';

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

const makeItem = (name: string, size: number): FileUploadFile => ({
  id: name,
  size,
  file: new File(['stub'], name),
});

export const Base: Story = {
  render: (args) => (
    <FileUpload
      aria-label="Upload a file"
      onChange={(items) => console.log(items)}
      {...args}
    />
  ),
};

export const SingleWithSelectedFile: Story = {
  render: (args) => (
    <FileUpload
      aria-label="Upload a file"
      defaultValue={[makeItem('project_report_2023.docx', 148909)]}
      showFileSize
      {...args}
    />
  ),
};

export const Multiple: Story = {
  render: (args) => (
    <FileUpload
      aria-label="Upload files"
      defaultValue={[
        makeItem('First.ext', 148909),
        makeItem('Second.ext', 148909),
        makeItem('Third.ext', 148909),
      ]}
      allowsMultiple
      {...args}
    />
  ),
};

export const MultipleEmpty: Story = {
  render: (args) => (
    <FileUpload aria-label="Upload files" allowsMultiple {...args} />
  ),
};

export const Scrollable: Story = {
  name: 'Multiple (scrollable list)',
  render: (args) => (
    <FileUpload
      aria-label="Upload files"
      defaultValue={Array.from({ length: 8 }, (_, index) =>
        makeItem(`document_${index + 1}.pdf`, 148909 * (index + 1))
      )}
      allowsMultiple
      showFileSize
      {...args}
    >
      <FileUpload.List style={{ maxBlockSize: 240 }} />
      <FileUpload.Dropzone />
    </FileUpload>
  ),
};

export const CompactEmpty: Story = {
  render: (args) => (
    <FileUpload
      aria-label="Upload files"
      size="compact"
      allowsMultiple
      {...args}
    />
  ),
};

export const Compact: Story = {
  render: (args) => (
    <FileUpload
      aria-label="Upload files"
      size="compact"
      defaultValue={[makeItem('project_report_2023.docx', 148909)]}
      allowsMultiple
      {...args}
    />
  ),
};

export const Controlled: Story = {
  render: function Render(args) {
    const [items, setItems] = useState<FileUploadFile[]>([
      makeItem('notes_january.docx', 148909),
    ]);

    return (
      <FileUpload
        aria-label="Upload files"
        value={items}
        onChange={setItems}
        allowsMultiple
        {...args}
      />
    );
  },
};

export const Validation: Story = {
  render: function Render(args) {
    const MAX_SIZE = 150_000; // 150 KB — arbitrary demo limit, compared against the file's real byte size

    const [items, setItems] = useState<FileUploadFile[]>([
      {
        id: 'presentation.pptx',
        file: new File([new Uint8Array(MAX_SIZE + 1)], 'presentation.pptx'),
        errorMessage: 'File is too large (max 150 KB)',
      },
    ]);

    return (
      <FileUpload
        aria-label="Upload files"
        value={items}
        onChange={(next) => {
          setItems(
            next.map((item) =>
              item.file.size > MAX_SIZE
                ? { ...item, errorMessage: 'File is too large (max 150 KB)' }
                : item
            )
          );
        }}
        allowsMultiple
        showFileSize
        {...args}
      />
    );
  },
};

export const UploadProgress: Story = {
  render: function Render(args) {
    const [items, setItems] = useState<FileUploadFile[]>([]);

    /** Stand-in for a real network upload — FileUpload never uploads anything itself. */
    function simulateUpload(onProgress: (progress: number) => void) {
      let progress = 0;

      const interval = window.setInterval(() => {
        progress += 20;
        onProgress(progress);

        if (progress >= 100) {
          window.clearInterval(interval);
        }
      }, 400);
    }

    return (
      <FileUpload
        aria-label="Upload files"
        value={items}
        onChange={setItems}
        onAdd={(added, all) => {
          setItems(
            all.map((item) =>
              added.some(({ id }) => id === item.id)
                ? { ...item, isLoading: true, progress: 0 }
                : item
            )
          );

          added.forEach((item) => {
            simulateUpload((progress) => {
              setItems((prev) =>
                prev.map((current) =>
                  current.id === item.id
                    ? {
                        ...current,
                        isLoading: progress < 100,
                        progress: progress < 100 ? progress : undefined,
                      }
                    : current
                )
              );
            });
          });
        }}
        allowsMultiple
        {...args}
      />
    );
  },
};

export const Disabled: Story = {
  render: (args) => (
    <FileUpload aria-label="Upload files" isDisabled allowsMultiple {...args} />
  ),
};

export const Invalid: Story = {
  render: (args) => (
    <FileUpload aria-label="Upload a file" isInvalid allowsMultiple {...args} />
  ),
};

export const Composition: Story = {
  name: 'Composition (compound parts)',
  render: (args) => (
    <FileUpload
      aria-label="Upload files"
      defaultValue={[
        makeItem('README.txt', 148909),
        makeItem('image.webp', 148909),
      ]}
      allowsMultiple
      showFileSize
      {...args}
    >
      <FileUpload.List />
      <FileUpload.Dropzone>
        <span>
          Drop files here or{' '}
          <FileUpload.Trigger>select files</FileUpload.Trigger>
        </span>
      </FileUpload.Dropzone>
    </FileUpload>
  ),
};

export const CustomContent: Story = {
  render: (args) => (
    <FileUpload aria-label="Upload files" allowsMultiple {...args}>
      <FileUpload.Dropzone>
        <strong>Drop password-protected ZIP archives here</strong>
        <span>
          or <FileUpload.Trigger>select files</FileUpload.Trigger>
        </span>
      </FileUpload.Dropzone>
    </FileUpload>
  ),
};
