import { useState } from 'react';
import type { ReactNode } from 'react';

import type { Key } from '@koobiq/react-core';
import { IconBoxArchive24 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button';
import { spacing } from '../layout';
import { Link } from '../Link';
import { ProgressSpinner } from '../ProgressSpinner';

import { FileUpload } from './FileUpload';
import type { FileUploadProps } from './types';

const meta = {
  title: 'Components/FileUpload',
  component: FileUpload,
  subcomponents: {
    'FileUpload.Empty': FileUpload.Empty,
    'FileUpload.EmptyIcon': FileUpload.EmptyIcon,
    'FileUpload.EmptyTitle': FileUpload.EmptyTitle,
    'FileUpload.EmptyDescription': FileUpload.EmptyDescription,
    'FileUpload.AddMore': FileUpload.AddMore,
    'FileUpload.Item': FileUpload.Item,
    'FileUpload.ItemIcon': FileUpload.ItemIcon,
    'FileUpload.ItemContent': FileUpload.ItemContent,
    'FileUpload.ItemName': FileUpload.ItemName,
    'FileUpload.ItemSize': FileUpload.ItemSize,
    'FileUpload.RemoveButton': FileUpload.RemoveButton,
    'FileUpload.Trigger': FileUpload.Trigger,
  },
  parameters: {
    layout: 'centered',
  },
  tags: ['status:new', 'date:2026-07-07'],
  decorators: [
    (Story) => (
      <div style={{ inlineSize: 500 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileUpload>;

export default meta;

type FileUploadItemData = {
  id: Key;
  name?: string;
  size?: number;
  isLoading?: boolean;
  progress?: number;
  errorMessage?: ReactNode;
  isDisabled?: boolean;
  downloadUrl?: string;
};

type Story = StoryObj<FileUploadProps<FileUploadItemData>>;

const makeItem = (name: string, size: number): FileUploadItemData => ({
  id: name,
  name,
  size,
});

const toItem = (file: File): FileUploadItemData => ({
  id: `${file.name}-${file.lastModified}-${file.size}`,
  name: file.name,
  size: file.size,
});

const removeById = (items: FileUploadItemData[], id: Key) =>
  items.filter((item) => item.id !== id);

export const Base: Story = {
  render: function Render(args) {
    return (
      <FileUpload aria-label="Upload a file" {...args}>
        <FileUpload.Item id="my-file" textValue="Secret.txt">
          <FileUpload.ItemIcon />
          <FileUpload.ItemContent>
            <FileUpload.ItemName>Secret.txt</FileUpload.ItemName>
            <FileUpload.ItemSize>{10000}</FileUpload.ItemSize>
          </FileUpload.ItemContent>
          <FileUpload.RemoveButton />
        </FileUpload.Item>
      </FileUpload>
    );
  },
};

export const SingleWithSelectedFile: Story = {
  render: function Render(args) {
    const [items, setItems] = useState<FileUploadItemData[]>([
      makeItem('project_report_2023.docx', 148909),
    ]);

    return (
      <FileUpload
        items={items}
        aria-label="Upload a file"
        onAdd={(files) => setItems(files.slice(0, 1).map(toItem))}
        onRemove={(id) => setItems((prev) => removeById(prev, id))}
        {...args}
      >
        {(item) => (
          <FileUpload.Item
            id={item.id}
            textValue={item.name}
            isDisabled={item.isDisabled}
            isInvalid={Boolean(item.errorMessage)}
          >
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              {item.size !== undefined && (
                <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
              )}
            </FileUpload.ItemContent>
            <FileUpload.RemoveButton />
          </FileUpload.Item>
        )}
      </FileUpload>
    );
  },
};

export const Multiple: Story = {
  render: function Render(args) {
    const [items, setItems] = useState<FileUploadItemData[]>([
      makeItem('First.ext', 148909),
      makeItem('Second.ext', 148909),
      makeItem('Third.ext', 148909),
    ]);

    return (
      <FileUpload
        items={items}
        aria-label="Upload files"
        onRemove={(id) => setItems((prev) => removeById(prev, id))}
        onAdd={(files) => setItems((prev) => [...prev, ...files.map(toItem)])}
        allowsMultiple
        {...args}
      >
        {(item) => (
          <FileUpload.Item
            id={item.id}
            textValue={item.name}
            isDisabled={item.isDisabled}
            isInvalid={Boolean(item.errorMessage)}
          >
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              {item.size !== undefined && (
                <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
              )}
            </FileUpload.ItemContent>
            <FileUpload.RemoveButton />
          </FileUpload.Item>
        )}
      </FileUpload>
    );
  },
};

export const ServerFile: Story = {
  render: function Render(args) {
    const [items, setItems] = useState<FileUploadItemData[]>([
      {
        id: 'security-scan-report.json',
        name: 'security-scan-report.json',
        size: 74,
        downloadUrl: '/files/security-scan-report.json',
      },
    ]);

    return (
      <FileUpload
        aria-label="Upload files"
        items={items}
        onAdd={(files) => setItems((prev) => [...prev, ...files.map(toItem)])}
        onRemove={(id) => setItems((prev) => removeById(prev, id))}
        allowsMultiple
        {...args}
      >
        {(item) => (
          <FileUpload.Item id={item.id} textValue={item.name}>
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>
                {item.downloadUrl ? (
                  <Link
                    href={item.downloadUrl}
                    download={item.name}
                    variant="inherit"
                  >
                    {item.name}
                  </Link>
                ) : (
                  item.name
                )}
              </FileUpload.ItemName>
              {item.size !== undefined && (
                <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
              )}
            </FileUpload.ItemContent>
            <FileUpload.RemoveButton />
          </FileUpload.Item>
        )}
      </FileUpload>
    );
  },
};

export const MultipleEmpty: Story = {
  render: function Render(args) {
    const [items, setItems] = useState<FileUploadItemData[]>([]);

    return (
      <FileUpload
        items={items}
        aria-label="Upload files"
        onAdd={(files) => setItems((prev) => [...prev, ...files.map(toItem)])}
        onRemove={(id) => setItems((prev) => removeById(prev, id))}
        allowsMultiple
        {...args}
      >
        {(item) => (
          <FileUpload.Item
            id={item.id}
            textValue={item.name}
            isDisabled={item.isDisabled}
            isInvalid={Boolean(item.errorMessage)}
          >
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              {item.size !== undefined && (
                <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
              )}
            </FileUpload.ItemContent>
            <FileUpload.RemoveButton />
          </FileUpload.Item>
        )}
      </FileUpload>
    );
  },
};

export const Scrollable: Story = {
  name: 'Multiple (scrollable list)',
  render: function Render(args) {
    const [items, setItems] = useState<FileUploadItemData[]>(
      Array.from({ length: 8 }, (_, index) =>
        makeItem(`document_${index + 1}.pdf`, 148909 * (index + 1))
      )
    );

    return (
      <FileUpload
        aria-label="Upload files"
        items={items}
        slotProps={{ list: { style: { maxBlockSize: 240 } } }}
        onAdd={(files) => setItems((prev) => [...prev, ...files.map(toItem)])}
        onRemove={(id) => setItems((prev) => removeById(prev, id))}
        allowsMultiple
        {...args}
      >
        {(item) => (
          <FileUpload.Item
            id={item.id}
            textValue={item.name}
            isDisabled={item.isDisabled}
            isInvalid={Boolean(item.errorMessage)}
          >
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              {item.size !== undefined && (
                <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
              )}
            </FileUpload.ItemContent>
            <FileUpload.RemoveButton />
          </FileUpload.Item>
        )}
      </FileUpload>
    );
  },
};

export const CompactEmpty: Story = {
  render: function Render(args) {
    const [items, setItems] = useState<FileUploadItemData[]>([]);

    return (
      <FileUpload
        items={items}
        size="compact"
        aria-label="Upload files"
        onRemove={(id) => setItems((prev) => removeById(prev, id))}
        onAdd={(files) => setItems((prev) => [...prev, ...files.map(toItem)])}
        allowsMultiple
        {...args}
      >
        {(item) => (
          <FileUpload.Item
            id={item.id}
            textValue={item.name}
            isDisabled={item.isDisabled}
            isInvalid={Boolean(item.errorMessage)}
          >
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              {item.size !== undefined && (
                <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
              )}
            </FileUpload.ItemContent>
            <FileUpload.RemoveButton />
          </FileUpload.Item>
        )}
      </FileUpload>
    );
  },
};

export const Compact: Story = {
  render: function Render(args) {
    const [items, setItems] = useState<FileUploadItemData[]>([
      makeItem('project_report_2023.docx', 148909),
    ]);

    return (
      <FileUpload
        items={items}
        size="compact"
        aria-label="Upload files"
        onAdd={(files) => setItems((prev) => [...prev, ...files.map(toItem)])}
        onRemove={(id) => setItems((prev) => removeById(prev, id))}
        allowsMultiple
        {...args}
      >
        {(item) => (
          <FileUpload.Item
            id={item.id}
            textValue={item.name}
            isDisabled={item.isDisabled}
            isInvalid={Boolean(item.errorMessage)}
          >
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              {item.size !== undefined && (
                <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
              )}
            </FileUpload.ItemContent>
            <FileUpload.RemoveButton />
          </FileUpload.Item>
        )}
      </FileUpload>
    );
  },
};

export const Validation: Story = {
  render: function Render(args) {
    const MAX_SIZE = 150_000;

    const [items, setItems] = useState<FileUploadItemData[]>([
      {
        ...makeItem('presentation.pptx', MAX_SIZE + 1),
        errorMessage: 'File is too large (max 150 KB)',
      },
    ]);

    const validate = (item: FileUploadItemData): FileUploadItemData =>
      item.size && item.size > MAX_SIZE
        ? { ...item, errorMessage: 'File is too large (max 150 KB)' }
        : item;

    return (
      <FileUpload
        aria-label="Upload files"
        items={items}
        onAdd={(files) =>
          setItems((prev) => [...prev, ...files.map(toItem).map(validate)])
        }
        onRemove={(id) => setItems((prev) => removeById(prev, id))}
        allowsMultiple
        {...args}
      >
        {(item) => (
          <FileUpload.Item
            id={item.id}
            textValue={item.name}
            isDisabled={item.isDisabled}
            isInvalid={Boolean(item.errorMessage)}
          >
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              {item.size !== undefined && (
                <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
              )}
            </FileUpload.ItemContent>
            <FileUpload.RemoveButton />
          </FileUpload.Item>
        )}
      </FileUpload>
    );
  },
};

export const UploadProgress: Story = {
  render: function Render(args) {
    const [items, setItems] = useState<FileUploadItemData[]>([]);

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
        items={items}
        aria-label="Upload files"
        onAdd={(files) => {
          const added = files.map((file) => ({
            ...toItem(file),
            isLoading: true,
            progress: 0,
          }));

          setItems((prev) => [...prev, ...added]);

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
        onRemove={(id) => setItems((prev) => removeById(prev, id))}
        allowsMultiple
        {...args}
      >
        {(item) => (
          <FileUpload.Item
            id={item.id}
            textValue={item.name}
            isInvalid={Boolean(item.errorMessage)}
          >
            <FileUpload.ItemIcon>
              {item.isLoading ? (
                <ProgressSpinner aria-label="Uploading" value={item.progress} />
              ) : undefined}
            </FileUpload.ItemIcon>
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              {item.size !== undefined && (
                <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
              )}
            </FileUpload.ItemContent>
            <FileUpload.RemoveButton />
          </FileUpload.Item>
        )}
      </FileUpload>
    );
  },
};

export const Disabled: Story = {
  render: function Render(args) {
    return (
      <FileUpload
        aria-label="Upload files"
        items={[]}
        isDisabled
        allowsMultiple
        {...args}
      >
        {(item) => (
          <FileUpload.Item
            id={item.id}
            textValue={item.name}
            isDisabled={item.isDisabled}
            isInvalid={Boolean(item.errorMessage)}
          >
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              {item.size !== undefined && (
                <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
              )}
            </FileUpload.ItemContent>
            <FileUpload.RemoveButton />
          </FileUpload.Item>
        )}
      </FileUpload>
    );
  },
};

export const Invalid: Story = {
  render: function Render(args) {
    return (
      <FileUpload
        aria-label="Upload a file"
        items={[]}
        isInvalid
        allowsMultiple
        {...args}
      >
        {(item) => (
          <FileUpload.Item
            id={item.id}
            textValue={item.name}
            isDisabled={item.isDisabled}
            isInvalid={Boolean(item.errorMessage)}
          >
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              {item.size !== undefined && (
                <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
              )}
            </FileUpload.ItemContent>
            <FileUpload.RemoveButton />
          </FileUpload.Item>
        )}
      </FileUpload>
    );
  },
};

export const CustomContent: Story = {
  render: function Render(args) {
    const [items, setItems] = useState<FileUploadItemData[]>([]);

    return (
      <FileUpload
        aria-label="Upload files"
        items={items}
        allowsMultiple
        onAdd={(files) => setItems((prev) => [...prev, ...files.map(toItem)])}
        onRemove={(id) => setItems((prev) => removeById(prev, id))}
        renderEmptyState={() => (
          <FileUpload.Empty>
            <FileUpload.EmptyIcon>
              <IconBoxArchive24 />
            </FileUpload.EmptyIcon>
            <FileUpload.EmptyTitle>
              Drop password-protected ZIP archives here
            </FileUpload.EmptyTitle>
            <FileUpload.EmptyDescription>
              <FileUpload.Trigger>
                <Button className={spacing({ mbs: 'xxs' })}>
                  Select files
                </Button>
              </FileUpload.Trigger>
            </FileUpload.EmptyDescription>
          </FileUpload.Empty>
        )}
        {...args}
      >
        {(item) => (
          <FileUpload.Item
            id={item.id}
            textValue={item.name}
            isDisabled={item.isDisabled}
            isInvalid={Boolean(item.errorMessage)}
          >
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              {item.size !== undefined && (
                <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
              )}
            </FileUpload.ItemContent>
            <FileUpload.RemoveButton />
          </FileUpload.Item>
        )}
      </FileUpload>
    );
  },
};
