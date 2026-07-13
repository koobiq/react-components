import { createRef, useState } from 'react';
import type { ReactNode } from 'react';

import type { Key } from '@koobiq/react-core';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ProgressSpinner } from '../ProgressSpinner';
import { Provider } from '../Provider';

import { readDroppedFiles } from './hooks';
import { FileUpload } from './index';
import type { FileUploadProps } from './index';

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

const getDropOverlay = () => document.querySelector('[data-slot="overlay"]');

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

  it('does not add a hidden drop button or a root tab stop', () => {
    renderComponent();

    const root = screen.getByTestId(ROOT_TEST_ID);

    expect(root).not.toHaveAttribute('tabindex');
    expect(root.querySelector('button')).not.toBeInTheDocument();
  });

  it('renders separate file and folder browse links in mixed mode', () => {
    renderComponent({ allowed: 'mixed', allowsMultiple: true });

    expect(screen.getByText('select files')).toBeInTheDocument();
    expect(screen.getByText('a folder')).toBeInTheDocument();
    expect(document.querySelectorAll('input[type="file"]')).toHaveLength(2);
  });

  it('allows the folder picker to return every file in single mode', () => {
    renderComponent({ allowed: 'folder' });

    const input = getFileInput();

    expect(input).toHaveAttribute('webkitdirectory');
    expect(input).toHaveAttribute('multiple');
  });

  it('normalizes the folder picker path to relativePath', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const file = makeFile('nested.txt');

    Object.defineProperty(file, 'webkitRelativePath', {
      value: 'folder/nested.txt',
    });

    renderComponent({ allowed: 'folder', onAdd });

    await user.upload(getFileInput(), file);

    expect(onAdd).toHaveBeenCalledWith([file]);
    expect(file).toHaveProperty('relativePath', 'folder/nested.txt');
  });

  it('calls onAdd with selected files and renders the external item update', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    const file = makeFile('hello.txt');

    renderComponent({ onAdd });

    await user.upload(getFileInput(), file);

    expect(onAdd).toHaveBeenCalledWith([file]);
    expect(file).toHaveProperty('relativePath', '');

    expect(
      Object.prototype.propertyIsEnumerable.call(file, 'relativePath')
    ).toBe(false);

    expect(screen.getByText('hello.txt')).toBeInTheDocument();
    expect(screen.queryByText('select a file')).not.toBeInTheDocument();
  });

  it('applies accept to files selected in the picker', async () => {
    const user = userEvent.setup({ applyAccept: false });
    const onAdd = vi.fn();
    const image = new File(['image'], 'image.png', { type: 'image/png' });
    const text = makeFile('notes.txt');

    renderComponent({
      accept: ['image/*'],
      allowsMultiple: true,
      onAdd,
    });

    await user.upload(getFileInput(), [image, text]);

    expect(onAdd).toHaveBeenCalledWith([image]);
  });

  it('uses the root as the default drop target', () => {
    renderComponent();

    const root = screen.getByTestId(ROOT_TEST_ID);
    const child = screen.getByText('select a file');
    const dataTransfer = createDataTransfer([dropFile('a.txt')]);

    fireEvent.dragEnter(root, { dataTransfer });
    fireEvent.dragEnter(child, { dataTransfer });
    fireEvent.dragLeave(child, { dataTransfer });

    expect(root).toHaveAttribute('data-drop-target');
    expect(getDropOverlay()).not.toBeInTheDocument();

    fireEvent.dragLeave(root, { dataTransfer });

    expect(root).not.toHaveAttribute('data-drop-target');
  });

  it('uses an external element as the only drop target', async () => {
    const targetRef = createRef<HTMLDivElement>();
    const onAdd = vi.fn();

    render(
      <>
        <div ref={targetRef} data-testid="external-target" />
        <TestFileUpload dropzoneTarget={targetRef} onAdd={onAdd} />
      </>
    );

    const root = screen.getByTestId(ROOT_TEST_ID);
    const target = screen.getByTestId('external-target');
    const file = makeFile('external.txt');
    const dataTransfer = createDataTransfer([dropFile(file)]);

    vi.spyOn(target, 'getBoundingClientRect').mockReturnValue({
      top: 10,
      left: 20,
      width: 300,
      height: 200,
    } as DOMRect);

    fireEvent.dragEnter(root, { dataTransfer });

    expect(root).not.toHaveAttribute('data-drop-target');
    expect(target).not.toHaveAttribute('data-drop-target');

    fireEvent.dragEnter(target, { dataTransfer });

    expect(target).toHaveAttribute('data-drop-target');
    expect(root).not.toHaveAttribute('data-drop-target');

    expect(getDropOverlay()).toHaveStyle({
      top: '10px',
      left: '20px',
      width: '300px',
      height: '200px',
    });

    expect(getDropOverlay()).not.toHaveAttribute('data-fullscreen');

    fireEvent.drop(target, { dataTransfer });

    await waitFor(() => expect(onAdd).toHaveBeenCalledWith([file]));
    expect(target).not.toHaveAttribute('data-drop-target');
    expect(getDropOverlay()).not.toBeInTheDocument();
  });

  it('renders non-interactive empty content in the external drop overlay', () => {
    const targetRef = createRef<HTMLDivElement>();
    const overlayRef = createRef<HTMLDivElement>();

    render(
      <>
        <div ref={targetRef} data-testid="external-target" />
        <FileUpload
          aria-label="upload"
          items={[makeItem('existing.txt')]}
          dropzoneTarget={targetRef}
          messages={{ dropOverlayTitle: 'Drop files now' }}
          slotProps={{
            dropOverlay: {
              ref: overlayRef,
              className: 'custom-overlay',
              id: 'drop-overlay',
            },
          }}
        >
          {renderItem}
        </FileUpload>
      </>
    );

    fireEvent.dragEnter(screen.getByTestId('external-target'), {
      dataTransfer: createDataTransfer([dropFile('a.txt')]),
    });

    expect(document.getElementById('drop-overlay')).toHaveTextContent(
      'Drop files now'
    );

    expect(document.getElementById('drop-overlay')).toHaveClass(
      'custom-overlay'
    );

    expect(overlayRef.current).toBe(document.getElementById('drop-overlay'));

    expect(
      getDropOverlay()?.querySelector('input[type="file"]')
    ).not.toBeInTheDocument();
  });

  it('covers the viewport in fullscreen mode', () => {
    const dataTransfer = createDataTransfer([dropFile('a.txt')]);

    renderComponent({ dropzoneTarget: 'fullscreen' });

    fireEvent.dragEnter(document.documentElement, { dataTransfer });

    expect(document.documentElement).toHaveAttribute('data-drop-target');
    expect(getDropOverlay()).toHaveAttribute('data-fullscreen');

    expect(getDropOverlay()).toHaveStyle({
      top: '0px',
      left: '0px',
      width: `${window.innerWidth}px`,
      height: `${window.innerHeight}px`,
    });

    fireEvent.dragLeave(document.documentElement, { dataTransfer });

    expect(document.documentElement).not.toHaveAttribute('data-drop-target');
    expect(getDropOverlay()).not.toBeInTheDocument();
  });

  it('moves native listeners when the external target changes', () => {
    const firstTargetRef = createRef<HTMLDivElement>();
    const secondTargetRef = createRef<HTMLDivElement>();

    const { rerender } = render(
      <>
        <div ref={firstTargetRef} data-testid="first-target" />
        <div ref={secondTargetRef} data-testid="second-target" />
        <TestFileUpload dropzoneTarget={firstTargetRef} />
      </>
    );

    const firstTarget = screen.getByTestId('first-target');
    const secondTarget = screen.getByTestId('second-target');
    const dataTransfer = createDataTransfer([dropFile('a.txt')]);

    fireEvent.dragEnter(firstTarget, { dataTransfer });
    expect(firstTarget).toHaveAttribute('data-drop-target');
    expect(getDropOverlay()).toBeInTheDocument();

    rerender(
      <>
        <div ref={firstTargetRef} data-testid="first-target" />
        <div ref={secondTargetRef} data-testid="second-target" />
        <TestFileUpload dropzoneTarget={secondTargetRef} />
      </>
    );

    expect(firstTarget).not.toHaveAttribute('data-drop-target');
    expect(getDropOverlay()).not.toBeInTheDocument();

    fireEvent.dragEnter(secondTarget, { dataTransfer });
    expect(secondTarget).toHaveAttribute('data-drop-target');
    expect(getDropOverlay()).toBeInTheDocument();
  });

  it('limits dropped files in single mode and keeps all in multiple mode', async () => {
    const singleOnAdd = vi.fn();
    const multipleOnAdd = vi.fn();
    const first = makeFile('first.txt');
    const second = makeFile('second.txt');

    const { unmount } = renderComponent({ onAdd: singleOnAdd });
    let root = screen.getByTestId(ROOT_TEST_ID);
    let dataTransfer = createDataTransfer([dropFile(first), dropFile(second)]);

    fireEvent.drop(root, { dataTransfer });

    await waitFor(() => expect(singleOnAdd).toHaveBeenCalledWith([first]));

    unmount();
    renderComponent({ allowsMultiple: true, onAdd: multipleOnAdd });
    root = screen.getByTestId(ROOT_TEST_ID);
    dataTransfer = createDataTransfer([dropFile(first), dropFile(second)]);

    fireEvent.drop(root, { dataTransfer });

    await waitFor(() =>
      expect(multipleOnAdd).toHaveBeenCalledWith([first, second])
    );
  });

  it('adds files from a dropped nested folder', async () => {
    const onAdd = vi.fn();
    const first = makeFile('a.txt');
    const second = makeFile('b.txt');

    renderComponent({ allowed: 'folder', allowsMultiple: true, onAdd });

    const dataTransfer = createDataTransfer([
      dropDirectory('outer', [
        fileEntry(first),
        directoryEntry('inner', [fileEntry(second)]),
      ]),
    ]);

    fireEvent.drop(screen.getByTestId(ROOT_TEST_ID), { dataTransfer });

    await waitFor(() => expect(onAdd).toHaveBeenCalledWith([first, second]));
    expect(first).toHaveProperty('relativePath', 'outer/a.txt');
    expect(second).toHaveProperty('relativePath', 'outer/inner/b.txt');
  });

  it('applies allowed mode to dropped files and folders', async () => {
    const looseFile = makeFile('loose.txt');
    const folderFile = makeFile('nested.txt');

    const dataTransfer = createDataTransfer([
      dropFile(looseFile),
      dropDirectory('folder', [fileEntry(folderFile)]),
    ]);

    const onAdd = vi.fn();

    const { unmount } = renderComponent({
      allowed: 'file',
      allowsMultiple: true,
      onAdd,
    });

    fireEvent.drop(screen.getByTestId(ROOT_TEST_ID), { dataTransfer });
    await waitFor(() => expect(onAdd).toHaveBeenCalledWith([looseFile]));

    unmount();
    onAdd.mockClear();

    renderComponent({ allowed: 'folder', allowsMultiple: true, onAdd });
    fireEvent.drop(screen.getByTestId(ROOT_TEST_ID), { dataTransfer });

    await waitFor(() => expect(onAdd).toHaveBeenCalledWith([folderFile]));
  });

  it('keeps every file from the first folder in single mode', async () => {
    const onAdd = vi.fn();
    const first = makeFile('a.txt');
    const second = makeFile('b.txt');

    renderComponent({ allowed: 'folder', onAdd });

    fireEvent.drop(screen.getByTestId(ROOT_TEST_ID), {
      dataTransfer: createDataTransfer([
        dropDirectory('folder', [fileEntry(first), fileEntry(second)]),
      ]),
    });

    await waitFor(() => expect(onAdd).toHaveBeenCalledWith([first, second]));
  });

  it('applies accept to dropped files', async () => {
    const onAdd = vi.fn();
    const image = new File(['image'], 'image.png', { type: 'image/png' });
    const text = makeFile('notes.txt');

    renderComponent({
      accept: ['image/*'],
      allowsMultiple: true,
      onAdd,
    });

    fireEvent.drop(screen.getByTestId(ROOT_TEST_ID), {
      dataTransfer: createDataTransfer([dropFile(image), dropFile(text)]),
    });

    await waitFor(() => expect(onAdd).toHaveBeenCalledWith([image]));
  });

  it('ignores disabled and non-file drags', () => {
    const onAdd = vi.fn();
    const { rerender } = render(<TestFileUpload isDisabled onAdd={onAdd} />);
    const root = screen.getByTestId(ROOT_TEST_ID);
    const fileTransfer = createDataTransfer([dropFile('disabled.txt')]);

    fireEvent.dragEnter(root, { dataTransfer: fileTransfer });
    fireEvent.drop(root, { dataTransfer: fileTransfer });

    expect(root).not.toHaveAttribute('data-drop-target');
    expect(onAdd).not.toHaveBeenCalled();

    rerender(<TestFileUpload onAdd={onAdd} />);

    const textTransfer = createDataTransfer([dropText()]);

    fireEvent.dragEnter(root, { dataTransfer: textTransfer });
    fireEvent.drop(root, { dataTransfer: textTransfer });

    expect(root).not.toHaveAttribute('data-drop-target');
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('clears the active target when the drag is cancelled', () => {
    renderComponent();

    const root = screen.getByTestId(ROOT_TEST_ID);
    const dataTransfer = createDataTransfer([dropFile('a.txt')]);

    fireEvent.dragEnter(root, { dataTransfer });
    expect(root).toHaveAttribute('data-drop-target');

    fireEvent.dragEnd(window);
    expect(root).not.toHaveAttribute('data-drop-target');
  });

  it('cleans an external target on unmount', () => {
    const targetRef = createRef<HTMLDivElement>();

    const { unmount } = render(
      <>
        <div ref={targetRef} data-testid="external-target" />
        <TestFileUpload dropzoneTarget={targetRef} />
      </>
    );

    const target = screen.getByTestId('external-target');
    const dataTransfer = createDataTransfer([dropFile('a.txt')]);

    fireEvent.dragEnter(target, { dataTransfer });
    expect(target).toHaveAttribute('data-drop-target');
    expect(getDropOverlay()).toBeInTheDocument();

    unmount();
    expect(target).not.toHaveAttribute('data-drop-target');
    expect(getDropOverlay()).not.toBeInTheDocument();
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

  it('renders a custom remove button icon', () => {
    render(
      <FileUpload aria-label="upload">
        <FileUpload.Item id="custom-icon.txt" textValue="custom-icon.txt">
          <FileUpload.ItemName>custom-icon.txt</FileUpload.ItemName>
          <FileUpload.RemoveButton>
            <span data-testid="custom-remove-icon" />
          </FileUpload.RemoveButton>
        </FileUpload.Item>
      </FileUpload>
    );

    expect(screen.getByTestId('custom-remove-icon')).toBeInTheDocument();
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

  it('supports a custom browse link label', async () => {
    const user = userEvent.setup();

    render(
      <FileUpload
        allowsMultiple
        aria-label="upload"
        items={[]}
        renderEmptyState={() => (
          <FileUpload.Empty>
            <FileUpload.Trigger>
              <span>Choose files</span>
            </FileUpload.Trigger>
          </FileUpload.Empty>
        )}
      >
        {renderItem}
      </FileUpload>
    );

    const clickSpy = vi
      .spyOn(getFileInput(), 'click')
      .mockImplementation(() => undefined);

    const triggerContent = screen.getByText('Choose files');

    expect(triggerContent.closest('a')).toBeInTheDocument();

    await user.click(triggerContent);

    expect(clickSpy).toHaveBeenCalled();
  });

  it('passes the disabled state to the browse link', async () => {
    const user = userEvent.setup();

    renderComponent({ isDisabled: true });

    const clickSpy = vi
      .spyOn(getFileInput(), 'click')
      .mockImplementation(() => undefined);

    const trigger = screen.getByText('select a file');

    expect(trigger).toHaveAttribute('data-disabled');

    await user.click(trigger);

    expect(clickSpy).not.toHaveBeenCalled();
  });

  it('restores focus to the browse link in multiple mode', async () => {
    const user = userEvent.setup();

    function MultipleFileUpload() {
      const [items, setItems] = useState<FileUploadItemData[]>([
        makeItem('only.txt'),
      ]);

      return (
        <FileUpload
          allowsMultiple
          aria-label="upload"
          items={items}
          onRemove={(id) =>
            setItems((current) => current.filter((item) => item.id !== id))
          }
        >
          {renderItem}
        </FileUpload>
      );
    }

    render(<MultipleFileUpload />);

    await user.click(screen.getByRole('button', { name: /remove only\.txt/i }));

    await waitFor(() => {
      expect(screen.getByText('select files')).toHaveFocus();
    });
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
    expect(screen.getByText('Drop more or')).toBeInTheDocument();

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

  it('uses the compact list empty state without calling renderEmptyState', () => {
    const renderEmptyState = vi.fn(() => <div>large empty</div>);
    const listEmptyRef = createRef<HTMLDivElement>();

    render(
      <FileUpload
        aria-label="upload"
        size="compact"
        allowsMultiple
        items={[]}
        renderEmptyState={renderEmptyState}
        slotProps={{
          listEmpty: {
            ref: listEmptyRef,
            id: 'list-empty',
            className: 'custom-list-empty',
          },
        }}
      >
        {renderItem}
      </FileUpload>
    );

    expect(renderEmptyState).not.toHaveBeenCalled();

    expect(document.getElementById('list-empty')).toHaveAttribute(
      'data-size',
      'compact'
    );

    expect(document.getElementById('list-empty')).toHaveClass(
      'custom-list-empty'
    );

    expect(listEmptyRef.current).toBe(document.getElementById('list-empty'));
    expect(screen.queryByText('large empty')).not.toBeInTheDocument();
  });

  it('uses the list empty state for an external drop target', () => {
    const targetRef = createRef<HTMLDivElement>();
    const renderEmptyState = vi.fn(() => <div>large empty</div>);

    render(
      <>
        <div ref={targetRef} />
        <FileUpload
          allowsMultiple
          aria-label="upload"
          dropzoneTarget={targetRef}
          items={[]}
          renderEmptyState={renderEmptyState}
        >
          {renderItem}
        </FileUpload>
      </>
    );

    expect(renderEmptyState).not.toHaveBeenCalled();
    expect(screen.getByText('select files')).toBeInTheDocument();
    expect(screen.queryByText('large empty')).not.toBeInTheDocument();
  });

  it('applies add-more slot props once populated', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <FileUpload
        aria-label="upload"
        size="compact"
        allowsMultiple
        items={[makeItem('a.txt')]}
        slotProps={{
          addMore: {
            ref,
            className: 'custom-add-more',
            id: 'add-more',
            children: 'replacement content',
          },
        }}
      >
        {renderItem}
      </FileUpload>
    );

    expect(document.getElementById('add-more')).toHaveAttribute(
      'data-size',
      'compact'
    );

    expect(document.getElementById('add-more')).toHaveClass('custom-add-more');
    expect(ref.current).toBe(document.getElementById('add-more'));
    expect(screen.getByText('Drop more or')).toBeInTheDocument();
    expect(screen.queryByText('replacement content')).not.toBeInTheDocument();
  });

  it('applies list slot props to the collection element', () => {
    render(
      <FileUpload
        aria-label="upload"
        allowsMultiple
        items={[makeItem('a.txt')]}
        slotProps={{
          list: {
            className: 'custom-list',
            style: { maxBlockSize: 240 },
            id: 'list',
          },
        }}
      >
        {renderItem}
      </FileUpload>
    );

    expect(document.getElementById('list')).toHaveClass('custom-list');

    expect(document.getElementById('list')).toHaveStyle({
      maxBlockSize: '240px',
    });
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

  it('renders custom empty-state children without filling missing parts', () => {
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
    expect(screen.queryByText('Drag here')).not.toBeInTheDocument();
    expect(screen.queryByText('select files')).not.toBeInTheDocument();
  });

  it('supports a fully custom empty state', () => {
    render(
      <FileUpload
        aria-label="upload"
        allowsMultiple
        items={[]}
        renderEmptyState={() => <div>Nothing uploaded</div>}
      >
        {renderItem}
      </FileUpload>
    );

    expect(screen.getByText('Nothing uploaded')).toBeInTheDocument();
    expect(screen.queryByText('select a file')).not.toBeInTheDocument();
  });

  it('hides the empty state when renderEmptyState returns null', () => {
    render(
      <FileUpload
        allowsMultiple
        aria-label="upload"
        items={[]}
        renderEmptyState={() => null}
      >
        {renderItem}
      </FileUpload>
    );

    expect(screen.queryByText('select a file')).not.toBeInTheDocument();
  });

  it('overrides localized messages without replacing the remaining strings', () => {
    render(
      <FileUpload
        aria-label="upload"
        allowsMultiple
        items={[makeItem('a.txt')]}
        messages={{
          addMoreText: 'Add another file',
          alternativeSeparator: 'otherwise',
        }}
      >
        {renderItem}
      </FileUpload>
    );

    expect(screen.getByText('Add another file otherwise')).toBeInTheDocument();
    expect(screen.getByText('select files')).toBeInTheDocument();
  });

  it('uses message overrides in the list empty state', () => {
    renderComponent({
      messages: {
        listEmptyText: 'Drop a document here',
        browseFile: 'choose a document',
      },
    });

    const trigger = screen.getByText('choose a document');

    expect(trigger).toBeInTheDocument();

    expect(trigger.parentElement).toHaveTextContent(
      'Drop a document here or choose a document'
    );
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

const fileEntry = (file: File): FileSystemFileEntry =>
  ({
    name: file.name,
    isFile: true,
    isDirectory: false,
    file: (resolve: FileCallback) => resolve(file),
  }) as unknown as FileSystemFileEntry;

const directoryEntry = (
  name: string,
  entries: FileSystemEntry[],
  batchSize = entries.length || 1
): FileSystemDirectoryEntry =>
  ({
    name,
    isFile: false,
    isDirectory: true,
    createReader: () => {
      let offset = 0;

      return {
        readEntries: (resolve: FileSystemEntriesCallback) => {
          const batch = entries.slice(offset, offset + batchSize);

          offset += batch.length;
          resolve(batch);
        },
      };
    },
  }) as unknown as FileSystemDirectoryEntry;

const dropFile = (value: string | File): DataTransferItem => {
  const file = typeof value === 'string' ? makeFile(value) : value;

  return {
    kind: 'file',
    type: file.type,
    getAsFile: () => file,
    getAsString: () => undefined,
    webkitGetAsEntry: () => fileEntry(file),
  } as DataTransferItem;
};

const dropText = (): DataTransferItem =>
  ({
    kind: 'string',
    type: 'text/plain',
    getAsFile: () => null,
    getAsString: () => undefined,
    webkitGetAsEntry: () => null,
  }) as DataTransferItem;

const dropDirectory = (
  name: string,
  entries: FileSystemEntry[],
  batchSize?: number
): DataTransferItem =>
  ({
    kind: 'file',
    type: '',
    getAsFile: () => null,
    getAsString: () => undefined,
    webkitGetAsEntry: () => directoryEntry(name, entries, batchSize),
  }) as DataTransferItem;

const createDataTransfer = (
  items: DataTransferItem[],
  fallbackFiles = items.flatMap((item) => {
    const file = item.getAsFile();

    return file ? [file] : [];
  })
): DataTransfer =>
  ({
    items,
    files: fallbackFiles,
    types: items.some((item) => item.kind === 'file')
      ? ['Files']
      : ['text/plain'],
    dropEffect: 'none',
  }) as unknown as DataTransfer;

describe('readDroppedFiles', () => {
  it('extracts native files and ignores non-file drop items', async () => {
    const files = await readDroppedFiles(
      createDataTransfer([dropFile('a.txt'), dropText(), dropFile('b.txt')])
    );

    expect(files.map((file) => file.name)).toEqual(['a.txt', 'b.txt']);
  });

  it('returns an empty array when there are no files', async () => {
    const files = await readDroppedFiles(createDataTransfer([dropText()]));

    expect(files).toEqual([]);
  });

  it('expands a dropped folder into its files', async () => {
    const files = await readDroppedFiles(
      createDataTransfer([
        dropDirectory('folder', [
          fileEntry(makeFile('a.txt')),
          fileEntry(makeFile('b.txt')),
        ]),
      ])
    );

    expect(files.map((file) => file.name)).toEqual(['a.txt', 'b.txt']);

    expect(files.map((file) => file.relativePath)).toEqual([
      'folder/a.txt',
      'folder/b.txt',
    ]);
  });

  it('expands nested folders recursively and keeps order', async () => {
    const files = await readDroppedFiles(
      createDataTransfer([
        dropFile('root.txt'),
        dropDirectory(
          'outer',
          [
            fileEntry(makeFile('a.txt')),
            directoryEntry('inner', [fileEntry(makeFile('b.txt'))]),
          ],
          1
        ),
      ])
    );

    expect(files.map((file) => file.name)).toEqual([
      'root.txt',
      'a.txt',
      'b.txt',
    ]);

    expect(files.map((file) => file.relativePath)).toEqual([
      '',
      'outer/a.txt',
      'outer/inner/b.txt',
    ]);
  });

  it('ignores non-file entries inside a dropped folder', async () => {
    const files = await readDroppedFiles(
      createDataTransfer([
        dropDirectory('folder', [
          fileEntry(makeFile('a.txt')),
          { isFile: false, isDirectory: false } as FileSystemEntry,
        ]),
      ])
    );

    expect(files.map((file) => file.name)).toEqual(['a.txt']);
  });

  it('falls back to DataTransfer.files when items are unavailable', async () => {
    const fallbackFiles = [makeFile('a.txt'), makeFile('b.txt')];
    const files = await readDroppedFiles(createDataTransfer([], fallbackFiles));

    expect(files).toEqual(fallbackFiles);
  });
});
