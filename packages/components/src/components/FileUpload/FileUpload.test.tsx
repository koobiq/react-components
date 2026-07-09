import { createRef, useState } from 'react';
import type { ReactNode } from 'react';

import type { Key } from '@koobiq/react-core';
import type { DropItem } from '@koobiq/react-primitives';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ProgressSpinner } from '../ProgressSpinner';
import { Provider } from '../Provider';

import { FileUpload } from './index';
import type { FileUploadProps } from './index';
import { readDroppedFiles } from './utils';

const ROOT_TEST_ID = 'file-upload';

type FileUploadItemData = {
  id: Key;
  name?: ReactNode;
  size?: number;
  isLoading?: boolean;
  progress?: number;
  errorMessage?: ReactNode;
  isDisabled?: boolean;
};

const makeFile = (name: string, content = 'stub') =>
  new File([content], name, { type: 'text/plain' });

const makeItem = (name: string, size?: number): FileUploadItemData => ({
  id: name,
  name,
  size,
});

const toItem = (file: File): FileUploadItemData => ({
  id: file.name,
  name: file.name,
  size: file.size,
});

const renderItem = (item: FileUploadItemData) => (
  <FileUpload.Item
    id={item.id}
    textValue={String(item.name ?? '')}
    isDisabled={item.isDisabled}
    isInvalid={Boolean(item.errorMessage)}
    data-loading={item.isLoading || undefined}
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
      {item.errorMessage}
    </FileUpload.ItemContent>
    <FileUpload.RemoveButton />
  </FileUpload.Item>
);

const getFileInput = () =>
  document.querySelector('input[type="file"]') as HTMLInputElement;

type TestFileUploadProps = Omit<
  FileUploadProps<FileUploadItemData>,
  'items' | 'children' | 'onAdd' | 'onRemove'
> & {
  initialItems?: FileUploadItemData[];
  onAdd?: (files: File[]) => void;
  onRemove?: (id: Key) => void;
};

function TestFileUpload(props: TestFileUploadProps) {
  const {
    onAdd,
    onRemove,
    initialItems = [],
    allowsMultiple = false,
    ...other
  } = props;

  const [items, setItems] = useState<FileUploadItemData[]>(initialItems);

  return (
    <FileUpload
      aria-label="upload"
      data-testid={ROOT_TEST_ID}
      items={items}
      allowsMultiple={allowsMultiple}
      onAdd={(files) => {
        onAdd?.(files);

        setItems((prev) =>
          allowsMultiple
            ? [...prev, ...files.map(toItem)]
            : files.slice(0, 1).map(toItem)
        );
      }}
      onRemove={(id) => {
        onRemove?.(id);
        setItems((prev) => prev.filter((item) => item.id !== id));
      }}
      {...other}
    >
      {renderItem}
    </FileUpload>
  );
}

const renderComponent = (props: TestFileUploadProps = {}) =>
  render(<TestFileUpload {...props} />);

describe('FileUpload', () => {
  it('should accept a ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <FileUpload
        aria-label="upload"
        data-testid={ROOT_TEST_ID}
        items={[]}
        ref={ref}
      >
        {renderItem}
      </FileUpload>
    );

    expect(ref.current).toBe(screen.getByTestId(ROOT_TEST_ID));
  });

  it('should merge a custom class name with the default ones', () => {
    renderComponent({ className: 'foo' });

    expect(screen.getByTestId(ROOT_TEST_ID)).toHaveClass('foo');
  });

  it('should apply custom styles', () => {
    renderComponent({ style: { padding: 20 } });

    expect(screen.getByTestId(ROOT_TEST_ID)).toHaveStyle({ padding: '20px' });
  });

  it('renders the browse link when empty', () => {
    renderComponent();

    expect(screen.getByText('select a file')).toBeInTheDocument();
  });

  it('calls onAdd with selected files and renders the external item update', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const file = makeFile('hello.txt');

    renderComponent({ onAdd });

    await user.upload(getFileInput(), file);

    expect(onAdd).toHaveBeenCalledWith([file]);
    expect(screen.getByText('hello.txt')).toBeInTheDocument();
    expect(screen.queryByText('select a file')).not.toBeInTheDocument();
  });

  it('formats file size in item rows', () => {
    renderComponent({
      initialItems: [makeItem('report.pdf', 148909)],
    });

    expect(screen.getByText('145.42 KB')).toBeInTheDocument();
  });

  it('appends files in multiple mode', async () => {
    const user = userEvent.setup();

    renderComponent({ allowsMultiple: true });

    await user.upload(getFileInput(), [makeFile('a.txt')]);
    await user.upload(getFileInput(), [makeFile('b.txt')]);

    expect(screen.getByText('a.txt')).toBeInTheDocument();
    expect(screen.getByText('b.txt')).toBeInTheDocument();
  });

  it('removes a file via the remove button and calls onRemove with the item id', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    renderComponent({
      onRemove,
      initialItems: [makeItem('remove-me.txt')],
    });

    await user.click(screen.getByRole('button', { name: /remove/i }));

    expect(screen.queryByText('remove-me.txt')).not.toBeInTheDocument();
    expect(onRemove).toHaveBeenCalledWith('remove-me.txt');
  });

  it('restores focus to the browse link after removing the last file', async () => {
    const user = userEvent.setup();

    renderComponent({ initialItems: [makeItem('only.txt')] });

    await user.click(screen.getByRole('button', { name: /remove/i }));

    await waitFor(() => {
      expect(screen.getByText('select a file')).toHaveFocus();
    });
  });

  it('moves focus to the next file after removing a middle one', async () => {
    const user = userEvent.setup();

    renderComponent({
      allowsMultiple: true,
      initialItems: [
        makeItem('first.txt'),
        makeItem('second.txt'),
        makeItem('third.txt'),
      ],
    });

    await user.click(
      screen.getByRole('button', { name: /remove second\.txt/i })
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /remove third\.txt/i })
      ).toHaveFocus();
    });
  });

  it('moves focus to the previous file after removing the last one', async () => {
    const user = userEvent.setup();

    renderComponent({
      allowsMultiple: true,
      initialItems: [
        makeItem('first.txt'),
        makeItem('second.txt'),
        makeItem('third.txt'),
      ],
    });

    await user.click(
      screen.getByRole('button', { name: /remove third\.txt/i })
    );

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /remove second\.txt/i })
      ).toHaveFocus();
    });
  });

  it('removes a file with the Delete key when the remove button is focused', () => {
    const onRemove = vi.fn();

    renderComponent({
      onRemove,
      initialItems: [makeItem('remove-me.txt')],
    });

    const button = screen.getByRole('button', { name: /remove/i });

    button.focus();
    fireEvent.keyDown(button, { key: 'Delete' });

    expect(screen.queryByText('remove-me.txt')).not.toBeInTheDocument();
    expect(onRemove).toHaveBeenCalledWith('remove-me.txt');
  });

  it('removes a file with the Backspace key when the remove button is focused', () => {
    const onRemove = vi.fn();

    renderComponent({
      onRemove,
      initialItems: [makeItem('remove-me.txt')],
    });

    const button = screen.getByRole('button', { name: /remove/i });

    button.focus();
    fireEvent.keyDown(button, { key: 'Backspace' });

    expect(screen.queryByText('remove-me.txt')).not.toBeInTheDocument();
    expect(onRemove).toHaveBeenCalledWith('remove-me.txt');
  });

  it('shows a determinate spinner and marks the row loading', () => {
    renderComponent({
      allowsMultiple: true,
      initialItems: [
        { ...makeItem('loading.txt'), isLoading: true, progress: 42 },
      ],
    });

    const progress = screen.getByRole('progressbar');

    expect(progress).toHaveAttribute('aria-valuenow', '42');
    expect(screen.getByRole('listitem')).toHaveAttribute('data-loading');
  });

  it('shows an indeterminate spinner when progress is not set', () => {
    renderComponent({
      initialItems: [{ ...makeItem('loading.txt'), isLoading: true }],
    });

    expect(screen.getByRole('progressbar')).not.toHaveAttribute(
      'aria-valuenow'
    );
  });

  it('marks the row invalid when errorMessage is set', () => {
    renderComponent({
      allowsMultiple: true,
      initialItems: [
        { ...makeItem('bad.txt'), errorMessage: 'Something went wrong' },
      ],
    });

    expect(screen.getByRole('listitem')).toHaveAttribute('data-invalid');
  });

  it('marks the root invalid when the isInvalid prop is set', () => {
    renderComponent({ isInvalid: true });

    expect(screen.getByTestId(ROOT_TEST_ID)).toHaveAttribute('data-invalid');
  });

  it('does not infer root invalid state from item data', () => {
    renderComponent({
      initialItems: [
        { ...makeItem('bad.txt'), errorMessage: 'Something went wrong' },
      ],
    });

    expect(screen.getByTestId(ROOT_TEST_ID)).not.toHaveAttribute(
      'data-invalid'
    );
  });

  it('does not call onAdd when disabled', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    renderComponent({ isDisabled: true, onAdd });

    await user.upload(getFileInput(), makeFile('nope.txt'));

    expect(screen.queryByText('nope.txt')).not.toBeInTheDocument();
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('opens the file dialog when the browse link is pressed', async () => {
    const user = userEvent.setup();

    renderComponent();

    const clickSpy = vi
      .spyOn(getFileInput(), 'click')
      .mockImplementation(() => undefined);

    await user.click(screen.getByText('select a file'));

    expect(clickSpy).toHaveBeenCalled();
  });

  it('supports custom collection item rendering', async () => {
    const user = userEvent.setup();

    function CustomRender() {
      const [items, setItems] = useState<FileUploadItemData[]>([
        makeItem('a.txt'),
      ]);

      return (
        <FileUpload
          allowsMultiple
          aria-label="upload"
          items={items}
          onAdd={(files) => setItems((prev) => [...prev, ...files.map(toItem)])}
          onRemove={(id) =>
            setItems((prev) => prev.filter((item) => item.id !== id))
          }
          renderAddMore={() => (
            <FileUpload.AddMore>
              <FileUpload.Trigger>browse</FileUpload.Trigger>
            </FileUpload.AddMore>
          )}
        >
          {(item) => (
            <FileUpload.Item id={item.id} textValue={String(item.name ?? '')}>
              <FileUpload.ItemName>{item.name}</FileUpload.ItemName>
              <FileUpload.RemoveButton />
            </FileUpload.Item>
          )}
        </FileUpload>
      );
    }

    render(<CustomRender />);

    expect(screen.getByText('a.txt')).toBeInTheDocument();
    expect(screen.getByText('browse')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /remove a\.txt/i }));

    expect(screen.queryByText('a.txt')).not.toBeInTheDocument();
  });

  it('supports static FileUpload.Item children without items', () => {
    render(
      <FileUpload aria-label="upload">
        <FileUpload.Item id="static.txt" textValue="static.txt">
          <FileUpload.ItemName>static.txt</FileUpload.ItemName>
          <FileUpload.RemoveButton />
        </FileUpload.Item>
      </FileUpload>
    );

    expect(screen.getByText('static.txt')).toBeInTheDocument();
  });

  it('forwards a ref on FileUpload.Item to its root element', () => {
    const ref = createRef<HTMLLIElement>();

    render(
      <FileUpload aria-label="upload">
        <FileUpload.Item id="ref-item.txt" ref={ref} data-testid="item">
          <FileUpload.ItemName>ref-item.txt</FileUpload.ItemName>
        </FileUpload.Item>
      </FileUpload>
    );

    expect(ref.current).toBe(screen.getByTestId('item'));
    expect(ref.current?.tagName).toBe('LI');
  });

  it('applies data-size to the empty state', () => {
    render(
      <FileUpload
        aria-label="upload"
        size="compact"
        items={[]}
        renderEmptyState={() => <FileUpload.Empty data-testid="empty" />}
      >
        {renderItem}
      </FileUpload>
    );

    expect(screen.getByTestId('empty')).toHaveAttribute('data-size', 'compact');
  });

  it('keeps data-size on add-more once populated', () => {
    render(
      <FileUpload
        aria-label="upload"
        size="compact"
        allowsMultiple
        items={[makeItem('a.txt')]}
        renderAddMore={() => <FileUpload.AddMore data-testid="add-more" />}
      >
        {renderItem}
      </FileUpload>
    );

    expect(screen.getByTestId('add-more')).toHaveAttribute(
      'data-size',
      'compact'
    );
  });

  it('renders the single selected file and hides the empty trigger', () => {
    renderComponent({ initialItems: [makeItem('single.txt')] });

    expect(screen.getByText('single.txt')).toBeInTheDocument();
    expect(screen.queryByText('select a file')).not.toBeInTheDocument();
  });

  it('renders the EmptyState title in the multiple empty default state', () => {
    renderComponent({ allowsMultiple: true });

    expect(screen.getByText('Drag here')).toBeInTheDocument();
  });

  it('fills missing empty-state slots during partial customization', () => {
    render(
      <FileUpload
        aria-label="upload"
        allowsMultiple
        items={[]}
        renderEmptyState={() => (
          <FileUpload.Empty>
            <FileUpload.EmptyIcon data-testid="custom-icon">
              icon
            </FileUpload.EmptyIcon>
          </FileUpload.Empty>
        )}
      >
        {renderItem}
      </FileUpload>
    );

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    expect(screen.getByText('Drag here')).toBeInTheDocument();
    expect(screen.getByText('select files')).toBeInTheDocument();
  });

  it('formats numeric ItemSize children using the current locale', () => {
    render(
      <FileUpload aria-label="upload">
        <FileUpload.Item id="size.txt" textValue="size.txt">
          <FileUpload.ItemSize>{148909}</FileUpload.ItemSize>
        </FileUpload.Item>
      </FileUpload>
    );

    expect(screen.getByText('145.42 KB')).toBeInTheDocument();
  });

  it('localizes strings via the Provider locale', () => {
    render(
      <Provider locale="ru-RU">
        <FileUpload aria-label="upload" items={[]}>
          {renderItem}
        </FileUpload>
      </Provider>
    );

    expect(screen.getByText('выберите файл')).toBeInTheDocument();
  });
});

const dropFile = (name: string): DropItem =>
  ({
    kind: 'file',
    type: 'text/plain',
    name,
    getFile: async () => makeFile(name),
    getText: async () => '',
  }) as unknown as DropItem;

const dropText = (): DropItem =>
  ({
    kind: 'text',
    types: new Set(['text/plain']),
    getText: async () => 'hello',
  }) as unknown as DropItem;

describe('readDroppedFiles', () => {
  it('extracts native files and ignores non-file drop items', async () => {
    const files = await readDroppedFiles([
      dropFile('a.txt'),
      dropText(),
      dropFile('b.txt'),
    ]);

    expect(files.map((file) => file.name)).toEqual(['a.txt', 'b.txt']);
  });

  it('returns an empty array when there are no files', async () => {
    const files = await readDroppedFiles([dropText()]);

    expect(files).toEqual([]);
  });
});
