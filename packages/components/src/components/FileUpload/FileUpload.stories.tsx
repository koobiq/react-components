import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';

import { I18nProvider } from '@koobiq/react-core';
import { IconFileO16 } from '@koobiq/react-icons';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../Button';
import { FlexBox } from '../FlexBox';

import { FileInput } from './components/FileInput';
import { LocalDropzone } from './components/LocalDropzone';
import { useFileDrop } from './hooks/useFileDrop';
import { useFileList } from './hooks/useFileList';
import { ruRUFileUploadConfig } from './locales';
import { MultipleFileUpload } from './MultipleFileUpload';
import { SingleFileUpload } from './SingleFileUpload';
import type { FileItem, FileUploadDropTarget } from './types';
import { formatDataSize, mapToFileItem } from './utils';
import { isCorrectExtension, maxFileSize } from './validators';

const mockFile = (name: string, bytes = 24_576, type = ''): File =>
  new File([new Uint8Array(bytes)], name, { type });

const mockItem = (name: string, bytes?: number): FileItem => ({
  file: mockFile(name, bytes),
  loading: false,
  progress: 0,
});

const meta = {
  title: 'Components/FileUpload',
  component: SingleFileUpload,
  subcomponents: { MultipleFileUpload },
  tags: ['status:new', 'date:2026-07-09'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SingleFileUpload>;

export default meta;

type Story = StoryObj<typeof meta>;

// --- validation helpers -------------------------------------------------------
// Validation is external: run a validator in `onChange` and feed the result into
// `isInvalid` / `errorMessage`. These small components back the validation
// stories below.

/** Single upload that validates each picked file inline. */
function SingleValidated({
  isValid,
  message,
}: {
  isValid: (file: File) => boolean;
  message: string;
}) {
  const [error, setError] = useState<string>();

  return (
    <div style={{ inlineSize: 360 }}>
      <SingleFileUpload
        isInvalid={!!error}
        errorMessage={error}
        shouldShowError={() => !!error}
        onChange={(item) =>
          setError(item && !isValid(item.file) ? message : undefined)
        }
      />
    </div>
  );
}

/** Multiple upload that flags each invalid row and shows a control-level message. */
function MultipleValidated({
  isValid,
  message,
}: {
  isValid: (file: File) => boolean;
  message: string;
}) {
  const [items, setItems] = useState<FileItem[]>([]);
  const [error, setError] = useState<string>();

  const handleChange = (next: FileItem[]) => {
    let hasInvalid = false;

    const marked = next.map((item) => {
      const invalid = !isValid(item.file);

      if (invalid) {
        hasInvalid = true;
      }

      return { ...item, hasError: invalid };
    });

    setItems(marked);
    setError(hasInvalid ? message : undefined);
  };

  return (
    <div style={{ inlineSize: 420 }}>
      <MultipleFileUpload
        value={items}
        onChange={handleChange}
        isInvalid={!!error}
        errorMessage={error}
        shouldShowError={() => !!error}
      />
    </div>
  );
}

/** Single upload inside a form; the error is revealed on submit. */
function SingleForm({
  validate,
}: {
  validate: (file: File | null) => string | null;
}) {
  const [value, setValue] = useState<FileItem | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const error = submitted ? validate(value?.file ?? null) : null;

  return (
    <form
      style={{ inlineSize: 360, display: 'grid', gap: 'var(--kbq-size-l)' }}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <SingleFileUpload
        value={value}
        onChange={setValue}
        isInvalid={!!error}
        errorMessage={error ?? undefined}
        shouldShowError={() => !!error}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}

/** Multiple upload inside a form; the error is revealed on submit. */
function MultipleForm({
  validate,
}: {
  validate: (files: File[]) => string | null;
}) {
  const [items, setItems] = useState<FileItem[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const error = submitted ? validate(items.map((item) => item.file)) : null;

  return (
    <form
      style={{ inlineSize: 420, display: 'grid', gap: 'var(--kbq-size-l)' }}
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <MultipleFileUpload
        value={items}
        onChange={setItems}
        isInvalid={!!error}
        errorMessage={error ?? undefined}
        shouldShowError={() => !!error}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}

// --- stories ------------------------------------------------------------------

export const Base: Story = {
  args: { allowed: 'file' },
  render: (args) => (
    <div style={{ inlineSize: 360 }}>
      <SingleFileUpload {...args} />
    </div>
  ),
};

export const Overview: Story = {
  render: () => (
    <div style={{ inlineSize: 360 }}>
      <SingleFileUpload
        defaultValue={mockItem('annual-review.pdf')}
        icon={<IconFileO16 />}
        showFileSize={false}
      />
    </div>
  ),
};

export const Multiple: Story = {
  render: () => (
    <div style={{ inlineSize: 420 }}>
      <MultipleFileUpload />
    </div>
  ),
};

export const MultipleWithFiles: Story = {
  render: () => (
    <div style={{ inlineSize: 420 }}>
      <MultipleFileUpload
        defaultValue={[
          mockItem('design-spec.fig', 262_144),
          mockItem('handoff.pdf', 524_288),
          mockItem('cover-image.png', 131_072),
        ]}
      />
    </div>
  ),
};

export const MultipleCompact: Story = {
  render: () => (
    <div style={{ inlineSize: 420 }}>
      <MultipleFileUpload size="compact" />
    </div>
  ),
};

export const SingleWithSize: Story = {
  render: () => (
    <div style={{ inlineSize: 360 }}>
      <SingleFileUpload defaultValue={mockItem('quarterly-report-final.pdf')} />
    </div>
  ),
};

export const MultipleCustomIcon: Story = {
  render: () => (
    <div style={{ inlineSize: 420 }}>
      <MultipleFileUpload
        defaultValue={[
          mockItem('photo-1.png', 131_072),
          mockItem('photo-2.jpg', 262_144),
        ]}
        renderFileIcon={() => <IconFileO16 />}
      />
    </div>
  ),
};

export const AllowedTypes: Story = {
  parameters: { layout: 'padded' },
  render: () => (
    <FlexBox gap="xl" wrap="wrap" alignItems="flex-start">
      {(['file', 'folder', 'mixed'] as const).map((allowed) => (
        <div key={allowed} style={{ inlineSize: 320 }}>
          <SingleFileUpload
            allowed={allowed}
            caption={`allowed="${allowed}"`}
          />
        </div>
      ))}
    </FlexBox>
  ),
};

export const MultipleDisabled: Story = {
  render: () => (
    <div style={{ inlineSize: 420 }}>
      <MultipleFileUpload
        isDisabled
        defaultValue={[mockItem('locked-1.pdf'), mockItem('locked-2.pdf')]}
      />
    </div>
  ),
};

export const MultipleError: Story = {
  render: () => (
    <div style={{ inlineSize: 420 }}>
      <MultipleFileUpload
        isInvalid
        errorMessage="Something is wrong with your selection."
        shouldShowError={() => true}
      />
    </div>
  ),
};

export const MultipleErrorFilled: Story = {
  render: () => (
    <div style={{ inlineSize: 420 }}>
      <MultipleFileUpload
        defaultValue={[
          mockItem('valid-file.pdf', 262_144),
          { ...mockItem('too-large.zip', 4_194_304), hasError: true },
          mockItem('cover.png', 131_072),
        ]}
        isInvalid
        errorMessage="“too-large.zip” exceeds the size limit."
        shouldShowError={() => true}
      />
    </div>
  ),
};

export const MultipleMaxHeight: Story = {
  render: () => (
    <div style={{ inlineSize: 420 }}>
      <MultipleFileUpload
        defaultValue={Array.from({ length: 9 }, (_, index) =>
          mockItem(`document-${index + 1}.pdf`, 131_072 * (index + 1))
        )}
        slotProps={{
          dropArea: {
            style: {
              '--fileupload-list-max-block-size': '240px',
            } as CSSProperties,
          },
        }}
      />
    </div>
  ),
};

export const MultipleFixedHeight: Story = {
  render: () => (
    <div style={{ inlineSize: 420 }}>
      <MultipleFileUpload
        defaultValue={[
          mockItem('spec.pdf', 262_144),
          mockItem('draft.docx', 131_072),
        ]}
        slotProps={{ dropArea: { style: { blockSize: 320 } } }}
      />
    </div>
  ),
};

export const FullScreenDropzone: Story = {
  render: () => (
    <div style={{ inlineSize: 420 }}>
      <MultipleFileUpload
        fullScreenDropzone={{
          title: 'Drop files anywhere',
          caption: 'Release to upload',
        }}
      />
    </div>
  ),
};

export const ConnectedLocalDropzone: Story = {
  render: function Render() {
    const target = useRef<FileUploadDropTarget>(null);

    return (
      <FlexBox gap="3xl" alignItems="flex-start">
        <div style={{ inlineSize: 360 }}>
          <MultipleFileUpload dropTargetRef={target} />
        </div>
        <LocalDropzone
          connectedTo={target}
          config={{ title: 'Drop onto the card' }}
        >
          <div
            style={{
              inlineSize: 240,
              blockSize: 160,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 'var(--kbq-size-s)',
              border: '1px dashed var(--kbq-line-contrast-less)',
            }}
          >
            Drag files over this card
          </div>
        </LocalDropzone>
      </FlexBox>
    );
  },
};

export const LocalizedProvider: Story = {
  render: () => (
    <I18nProvider locale="ru-RU">
      <div style={{ inlineSize: 420 }}>
        <MultipleFileUpload />
      </div>
    </I18nProvider>
  ),
};

export const LocalizedConfig: Story = {
  render: () => (
    <div style={{ inlineSize: 420 }}>
      <MultipleFileUpload localeConfig={ruRUFileUploadConfig.multiple} />
    </div>
  ),
};

export const Loading: Story = {
  render: function Render() {
    const [value, setValue] = useState<FileItem | null>({
      file: mockFile('uploading.mov', 8_388_608),
      loading: true,
      progress: 62,
    });

    return (
      <div style={{ inlineSize: 360 }}>
        <SingleFileUpload value={value} onChange={setValue} />
      </div>
    );
  },
};

export const IndeterminateLoading: Story = {
  render: () => (
    <div style={{ inlineSize: 360 }}>
      <SingleFileUpload
        progressMode="indeterminate"
        defaultValue={{
          file: mockFile('processing.zip', 4_194_304),
          loading: true,
          progress: 0,
        }}
      />
    </div>
  ),
};

export const Processing: Story = {
  render: function Render() {
    const [value, setValue] = useState<FileItem | null>(null);

    const handleChange = (item: FileItem | null) => {
      if (!item) {
        setValue(null);

        return;
      }

      // Simulate an upload that finishes, then flags a processing issue.
      setValue({ ...item, loading: true, progress: 0 });

      setTimeout(
        () => setValue({ ...item, loading: false, hasError: true }),
        1500
      );
    };

    return (
      <div style={{ inlineSize: 360 }}>
        <SingleFileUpload
          value={value}
          onChange={handleChange}
          isInvalid={!!value?.hasError}
          errorMessage="Processing found an issue with this file."
          shouldShowError={() => !!value?.hasError}
        />
      </div>
    );
  },
};

export const NativeForm: Story = {
  render: function Render() {
    const [value, setValue] = useState<FileItem | null>(null);
    const [touched, setTouched] = useState(false);
    const [submitted, setSubmitted] = useState<string | null>(null);
    const required = touched && !value;

    return (
      <form
        style={{ inlineSize: 360, display: 'grid', gap: 'var(--kbq-size-l)' }}
        onSubmit={(event) => {
          event.preventDefault();
          setTouched(true);

          if (value) {
            setSubmitted(value.file.name);
          }
        }}
      >
        <SingleFileUpload
          value={value}
          onChange={setValue}
          onBlur={() => setTouched(true)}
          isInvalid={required}
          errorMessage="A file is required."
          shouldShowError={() => required}
        />
        <Button type="submit">Upload</Button>
        {submitted ? <span>Submitted: {submitted}</span> : null}
      </form>
    );
  },
};

export const SingleRequired: Story = {
  render: () => (
    <SingleForm validate={(file) => (file ? null : 'A file is required.')} />
  ),
};

export const MultipleRequired: Story = {
  render: () => (
    <MultipleForm
      validate={(files) => (files.length ? null : 'Add at least one file.')}
    />
  ),
};

export const SingleSizeValidation: Story = {
  render: () => (
    <SingleValidated
      isValid={(file) => !maxFileSize(500_000)(file)}
      message="The file must be 500 KB or smaller."
    />
  ),
};

export const MultipleSizeValidation: Story = {
  render: () => (
    <MultipleValidated
      isValid={(file) => !maxFileSize(500_000)(file)}
      message="Some files are larger than 500 KB."
    />
  ),
};

export const SingleExtensionValidation: Story = {
  render: () => (
    <SingleValidated
      isValid={(file) => !isCorrectExtension(['.png', '.jpg'])(file)}
      message="Only PNG or JPG files are allowed."
    />
  ),
};

export const MultipleExtensionValidation: Story = {
  render: () => (
    <MultipleValidated
      isValid={(file) => !isCorrectExtension(['.png', '.jpg'])(file)}
      message="Only PNG or JPG files are allowed."
    />
  ),
};

export const SingleMixedValidation: Story = {
  render: () => (
    <SingleForm
      validate={(file) => {
        if (!file) {
          return 'A file is required.';
        }

        if (isCorrectExtension(['.pdf'])(file)) {
          return 'Only PDF files are allowed.';
        }

        return null;
      }}
    />
  ),
};

export const MultipleMixedValidation: Story = {
  render: () => (
    <MultipleForm
      validate={(files) => {
        if (!files.length) {
          return 'Add at least one file.';
        }

        if (files.some((file) => isCorrectExtension(['.pdf'])(file))) {
          return 'Only PDF files are allowed.';
        }

        return null;
      }}
    />
  ),
};

export const SingleAsyncValidation: Story = {
  render: function Render() {
    const [value, setValue] = useState<FileItem | null>(null);
    const [checking, setChecking] = useState(false);
    const [error, setError] = useState<string>();

    const handleChange = (item: FileItem | null) => {
      setValue(item);
      setError(undefined);

      if (!item) {
        return;
      }

      // Simulate an asynchronous server-side content check.
      setChecking(true);

      setTimeout(() => {
        setChecking(false);

        setError(
          item.file.size > 300_000
            ? 'The file did not pass the server check.'
            : undefined
        );
      }, 1200);
    };

    return (
      <div style={{ inlineSize: 360 }}>
        <SingleFileUpload
          value={value ? { ...value, loading: checking } : null}
          onChange={handleChange}
          isInvalid={!!error}
          errorMessage={error}
          shouldShowError={() => !!error}
        />
      </div>
    );
  },
};

export const Primitives: Story = {
  render: function Render() {
    const fileList = useFileList<FileItem>({ defaultList: [] });

    const { dropRef } = useFileDrop<HTMLDivElement>({
      onFilesDropped: (files) => fileList.addArray(files.map(mapToFileItem)),
    });

    return (
      <div
        ref={dropRef}
        style={{
          inlineSize: 420,
          display: 'grid',
          gap: 'var(--kbq-size-s)',
          padding: 'var(--kbq-size-l)',
          borderRadius: 'var(--kbq-size-s)',
          border: '1px dashed var(--kbq-line-contrast-fade)',
        }}
      >
        <FileInput
          multiple
          accept="image/*"
          onChange={(event) =>
            fileList.addArray(
              Array.from(event.target.files ?? []).map(mapToFileItem)
            )
          }
        >
          Browse or drop images
        </FileInput>
        {fileList.list.length > 0 ? (
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: 'none',
              display: 'grid',
              gap: 'var(--kbq-size-xxs)',
            }}
          >
            {fileList.list.map((item, index) => (
              <li
                key={index}
                style={{
                  display: 'flex',
                  gap: 'var(--kbq-size-s)',
                  alignItems: 'center',
                }}
              >
                <span style={{ flex: 1 }}>{item.file.name}</span>
                <span>{formatDataSize(item.file.size)}</span>
                <button
                  type="button"
                  aria-label={`Remove ${item.file.name}`}
                  onClick={() => fileList.removeAt(index)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    );
  },
};
