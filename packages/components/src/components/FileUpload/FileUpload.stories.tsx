import { useRef, useState } from 'react';

import { type Key, useBoolean } from '@koobiq/react-core';
import {
  IconFolder16,
  IconBoxArchive24,
  IconCircleCheck16,
} from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';
import { Form } from '../Form';
import { spacing } from '../layout';
import { ProgressSpinner } from '../ProgressSpinner';
import { Toggle } from '../Toggle';
import { Typography } from '../Typography';

import { FileUpload } from './FileUpload';
import type { FileUploadFile, FileUploadProps } from './types';

const meta = {
  title: 'Components/FileUpload',
  component: FileUpload,
  subcomponents: {
    'FileUpload.Empty': FileUpload.Empty,
    'FileUpload.EmptyIcon': FileUpload.EmptyIcon,
    'FileUpload.EmptyTitle': FileUpload.EmptyTitle,
    'FileUpload.EmptyDescription': FileUpload.EmptyDescription,
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
  isUploaded?: boolean;
  progress?: number;
  isDisabled?: boolean;
  kind?: 'file' | 'folder';
  file?: FileUploadFile;
  files?: FileUploadFile[];
};

type Story = StoryObj<FileUploadProps<FileUploadItemData>>;

const imageFileTypes = [
  '.png',
  '.jpg',
  '.jpeg',
  '.gif',
  '.webp',
  '.svg',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

const makeFile = (
  name: string,
  size: number,
  type = 'application/octet-stream'
): FileUploadFile =>
  Object.assign(new File([new Uint8Array(size)], name, { type }), {
    relativePath: '',
  });

const toItem = (file: FileUploadFile): FileUploadItemData => ({
  id: crypto.randomUUID(),
  kind: 'file',
  name: file.name,
  size: file.size,
  file,
});

const makeItem = (
  name: string,
  size: number,
  type?: string
): FileUploadItemData => toItem(makeFile(name, size, type));

const removeById = (items: FileUploadItemData[], id: Key) =>
  items.filter((item) => item.id !== id);

export const Base: Story = {
  render: function Render(args) {
    const [items, setItems] = useState<FileUploadItemData[]>([]);

    return (
      <FileUpload
        items={items}
        aria-label="Upload a file"
        onAdd={(files) => setItems(files.map(toItem))}
        onRemove={(id) => setItems((prev) => removeById(prev, id))}
        {...args}
      >
        {(item) => (
          <FileUpload.Item id={item.id} textValue={item.name} file={item.file}>
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
            </FileUpload.ItemContent>
            <FileUpload.RemoveButton />
          </FileUpload.Item>
        )}
      </FileUpload>
    );
  },
};

export const LongFileName: Story = {
  render: function Render(args) {
    const name =
      'incident-response-evidence-security-scan-report-for-production-environment.json';

    const file = makeFile(name, 10000, 'application/json');

    return (
      <FileUpload aria-label="Upload a file" {...args}>
        <FileUpload.Item id={name} textValue={name} file={file}>
          <FileUpload.ItemIcon />
          <FileUpload.ItemContent>
            <FileUpload.ItemName>{name}</FileUpload.ItemName>
            <FileUpload.ItemSize>{file.size}</FileUpload.ItemSize>
          </FileUpload.ItemContent>
          <FileUpload.RemoveButton />
        </FileUpload.Item>
      </FileUpload>
    );
  },
};

export const WithLabel: Story = {
  render: function Render(args) {
    const [items, setItems] = useState<FileUploadItemData[]>([]);

    return (
      <FileUpload
        label="Evidence"
        caption="Attach the files required for the investigation."
        items={items}
        onAdd={(files) => setItems(files.map(toItem))}
        onRemove={(id) => setItems((prev) => removeById(prev, id))}
        {...args}
      >
        {(item) => (
          <FileUpload.Item id={item.id} textValue={item.name} file={item.file}>
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
            </FileUpload.ItemContent>
            <FileUpload.RemoveButton />
          </FileUpload.Item>
        )}
      </FileUpload>
    );
  },
};

export const Single: Story = {
  render: function Render(args) {
    const [items, setItems] = useState<FileUploadItemData[]>([]);

    return (
      <FileUpload
        items={items}
        aria-label="Upload a file"
        onAdd={(files) => setItems(files.map(toItem))}
        onRemove={(id) => setItems((prev) => removeById(prev, id))}
        {...args}
      >
        {(item) => (
          <FileUpload.Item
            id={item.id}
            textValue={item.name}
            file={item.file}
            isDisabled={item.isDisabled}
          >
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
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
    const [items, setItems] = useState<FileUploadItemData[]>([]);

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
            file={item.file}
            isDisabled={item.isDisabled}
          >
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
            </FileUpload.ItemContent>
            <FileUpload.RemoveButton />
          </FileUpload.Item>
        )}
      </FileUpload>
    );
  },
};

export const WithoutDuplicates: Story = {
  render: function Render(args) {
    const getFileFingerprint = (file: File) =>
      `${file.name}-${file.lastModified}-${file.size}`;

    const [items, setItems] = useState<FileUploadItemData[]>([]);

    return (
      <FileUpload
        items={items}
        aria-label="Upload files"
        onRemove={(id) => setItems((prev) => removeById(prev, id))}
        onAdd={(files) =>
          setItems((prev) => {
            const fingerprints = new Set(
              prev.flatMap((item) =>
                item.file ? [getFileFingerprint(item.file)] : []
              )
            );

            const added = files.flatMap((file) => {
              const fingerprint = getFileFingerprint(file);

              if (fingerprints.has(fingerprint)) return [];

              fingerprints.add(fingerprint);

              return [toItem(file)];
            });

            return [...prev, ...added];
          })
        }
        allowsMultiple
        {...args}
      >
        {(item) => (
          <FileUpload.Item id={item.id} textValue={item.name} file={item.file}>
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
            </FileUpload.ItemContent>
            <FileUpload.RemoveButton />
          </FileUpload.Item>
        )}
      </FileUpload>
    );
  },
};

export const Allowed: Story = {
  name: 'Selecting a folder or files',
  render: function Render(args) {
    const toGroupedItems = (files: FileUploadFile[]): FileUploadItemData[] => {
      const folders = new Map<string, FileUploadFile[]>();
      const items: FileUploadItemData[] = [];

      files.forEach((file) => {
        const folderName = file.relativePath.split('/')[0];

        if (folderName) {
          folders.set(folderName, [...(folders.get(folderName) ?? []), file]);
        } else {
          items.push(toItem(file));
        }
      });

      folders.forEach((folderFiles, name) => {
        items.push({
          id: crypto.randomUUID(),
          kind: 'folder',
          name,
          files: folderFiles,
          size: folderFiles.reduce((total, file) => total + file.size, 0),
        });
      });

      return items;
    };

    const [items, setItems] = useState<FileUploadItemData[]>([]);

    return (
      <FileUpload
        items={items}
        allowed="mixed"
        aria-label="Upload files or a folder"
        onRemove={(id) => setItems((prev) => removeById(prev, id))}
        onAdd={(files) =>
          setItems((prev) => [...prev, ...toGroupedItems(files)])
        }
        allowsMultiple
        {...args}
      >
        {(item) => (
          <FileUpload.Item
            id={item.id}
            textValue={item.name}
            file={item.file}
            isDisabled={item.isDisabled}
          >
            <FileUpload.ItemIcon>
              {item.kind === 'folder' ? <IconFolder16 /> : undefined}
            </FileUpload.ItemIcon>
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
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
            file={item.file}
            isDisabled={item.isDisabled}
          >
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
            </FileUpload.ItemContent>
            <FileUpload.RemoveButton />
          </FileUpload.Item>
        )}
      </FileUpload>
    );
  },
};

export const Scrollable: Story = {
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
        slotProps={{
          list: { fileList: { style: { maxBlockSize: 240 } } },
        }}
        onAdd={(files) => setItems((prev) => [...prev, ...files.map(toItem)])}
        onRemove={(id) => setItems((prev) => removeById(prev, id))}
        allowsMultiple
        {...args}
      >
        {(item) => (
          <FileUpload.Item
            id={item.id}
            textValue={item.name}
            file={item.file}
            isDisabled={item.isDisabled}
          >
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
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
          <FileUpload.Item id={item.id} textValue={item.name} file={item.file}>
            <FileUpload.ItemIcon>
              {item.isLoading ? (
                <ProgressSpinner aria-label="Uploading" value={item.progress} />
              ) : undefined}
            </FileUpload.ItemIcon>
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
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
    const MAX_SIZE = 150 * 1024;

    const [items, setItems] = useState<FileUploadItemData[]>(() =>
      [
        makeFile('notes.txt', 1000, 'text/plain'),
        makeFile('large-image.png', MAX_SIZE + 1, 'image/png'),
        makeFile('empty-image.png', 0, 'image/png'),
        makeFile('valid-image.png', 1000, 'image/png'),
      ].map(toItem)
    );

    return (
      <FileUpload
        aria-label="Upload images"
        items={items}
        accept={imageFileTypes}
        maxFileSize={MAX_SIZE}
        caption="Accepts PNG, JPG, GIF, WebP, and SVG up to 150 KB"
        validate={(file) =>
          file.size === 0 ? 'Empty files are not allowed' : null
        }
        errorMessage={({ validationErrors }) => (
          <FlexBox as="span" direction="column" gap="xxs">
            {validationErrors.map((error, index) => (
              <span key={`${error}-${index}`}>{error}</span>
            ))}
          </FlexBox>
        )}
        onAdd={(files) => setItems((prev) => [...prev, ...files.map(toItem)])}
        onRemove={(id) => setItems((prev) => removeById(prev, id))}
        renderEmptyState={() => (
          <FileUpload.Empty>
            <FileUpload.EmptyIcon />
            <FileUpload.EmptyTitle>Upload images</FileUpload.EmptyTitle>
            <FileUpload.EmptyDescription>
              Drag images here or{' '}
              <FileUpload.Trigger>select images</FileUpload.Trigger>
            </FileUpload.EmptyDescription>
          </FileUpload.Empty>
        )}
        allowsMultiple
        {...args}
      >
        {(item) => (
          <FileUpload.Item
            id={item.id}
            textValue={item.name}
            file={item.file}
            isDisabled={item.isDisabled}
          >
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
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
            file={item.file}
            isDisabled={item.isDisabled}
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
        errorMessage="Select at least one file."
        items={[]}
        isInvalid
        allowsMultiple
        {...args}
      >
        {(item) => (
          <FileUpload.Item
            id={item.id}
            textValue={item.name}
            file={item.file}
            isDisabled={item.isDisabled}
          >
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
            </FileUpload.ItemContent>
            <FileUpload.RemoveButton />
          </FileUpload.Item>
        )}
      </FileUpload>
    );
  },
};

export const DropzoneTarget: Story = {
  name: 'Drop zone target',
  render: function Render(args) {
    const dropTargetRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, { set: setFullscreen }] = useBoolean(false);
    const [items, setItems] = useState<FileUploadItemData[]>([]);

    return (
      <div ref={dropTargetRef} className={spacing({ p: 'm' })}>
        <Toggle
          isSelected={isFullscreen}
          onChange={setFullscreen}
          className={spacing({ mbe: 'm' })}
        >
          Activate fullscreen dropzone
        </Toggle>
        <Typography style={{ marginBlockEnd: '1em' }}>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum iure
          molestiae perferendis provident quod repudiandae. Ab fugiat itaque
          nihil officia.
        </Typography>
        <FileUpload
          items={items}
          aria-label="Upload files"
          dropzoneTarget={isFullscreen ? 'fullscreen' : dropTargetRef}
          onAdd={(files) => setItems((prev) => [...prev, ...files.map(toItem)])}
          onRemove={(id) => setItems((prev) => removeById(prev, id))}
          allowsMultiple
          {...args}
        >
          {(item) => (
            <FileUpload.Item
              id={item.id}
              textValue={item.name}
              file={item.file}
            >
              <FileUpload.ItemIcon />
              <FileUpload.ItemContent>
                <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
                <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
              </FileUpload.ItemContent>
              <FileUpload.RemoveButton />
            </FileUpload.Item>
          )}
        </FileUpload>
      </div>
    );
  },
};

export const ServerFile: Story = {
  render: function Render(args) {
    // Mock POST /api/files.
    const uploadFilesToServer = async (formData: FormData) => {
      await new Promise((resolve) => setTimeout(resolve, 800));

      return formData.getAll('files');
    };

    const [isUploading, setUploading] = useState(false);
    const [items, setItems] = useState<FileUploadItemData[]>([]);

    return (
      <Form
        onSubmit={async (event) => {
          event.preventDefault();

          const localFiles = items.flatMap((item) =>
            item.file && !item.isUploaded
              ? [{ id: item.id, file: item.file }]
              : []
          );

          if (localFiles.length === 0) return;

          const formData = new FormData();

          localFiles.forEach(({ file }) =>
            formData.append('files', file, file.name)
          );

          const uploadingIds = new Set(localFiles.map(({ id }) => id));

          setItems((current) =>
            current.map((item) =>
              uploadingIds.has(item.id) ? { ...item, isLoading: true } : item
            )
          );

          setUploading(true);

          try {
            await uploadFilesToServer(formData);

            setItems((current) =>
              current.map((item) =>
                uploadingIds.has(item.id)
                  ? { ...item, isLoading: false, isUploaded: true }
                  : item
              )
            );
          } finally {
            setUploading(false);
          }
        }}
      >
        <FileUpload
          aria-label="Upload files"
          items={items}
          onAdd={(files) => setItems((prev) => [...prev, ...files.map(toItem)])}
          onRemove={(id) => setItems((prev) => removeById(prev, id))}
          allowsMultiple
          {...args}
        >
          {(item) => (
            <FileUpload.Item
              id={item.id}
              textValue={item.name}
              file={item.file}
            >
              <FileUpload.ItemIcon>
                {item.isLoading ? (
                  <ProgressSpinner aria-label="Uploading" />
                ) : item.isUploaded ? (
                  <IconCircleCheck16
                    aria-label="Uploaded"
                    style={{ color: 'var(--kbq-icon-success)' }}
                  />
                ) : undefined}
              </FileUpload.ItemIcon>
              <FileUpload.ItemContent>
                <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
                <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
              </FileUpload.ItemContent>
              <FileUpload.RemoveButton />
            </FileUpload.Item>
          )}
        </FileUpload>
        <Form.Actions>
          <Button
            type="submit"
            isLoading={isUploading}
            isDisabled={!items.some((item) => item.file && !item.isUploaded)}
          >
            Upload files
          </Button>
        </Form.Actions>
      </Form>
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
        messages={{
          emptyTitle: 'Drop password-protected ZIP archives here',
          browseFiles: 'select files',
          addMoreText: 'Drop more ZIP archives',
        }}
        onAdd={(files) => setItems((prev) => [...prev, ...files.map(toItem)])}
        onRemove={(id) => setItems((prev) => removeById(prev, id))}
        renderEmptyState={() => (
          <FileUpload.Empty>
            <FileUpload.EmptyIcon>
              <IconBoxArchive24 />
            </FileUpload.EmptyIcon>
            <FileUpload.EmptyTitle />
            <FileUpload.EmptyDescription />
          </FileUpload.Empty>
        )}
        {...args}
      >
        {(item) => (
          <FileUpload.Item
            id={item.id}
            textValue={item.name}
            file={item.file}
            isDisabled={item.isDisabled}
          >
            <FileUpload.ItemIcon />
            <FileUpload.ItemContent>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              <FileUpload.ItemSize>{item.size}</FileUpload.ItemSize>
            </FileUpload.ItemContent>
            <FileUpload.RemoveButton />
          </FileUpload.Item>
        )}
      </FileUpload>
    );
  },
};
