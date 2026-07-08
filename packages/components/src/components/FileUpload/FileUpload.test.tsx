import { createRef, useState } from 'react';

import type { DropItem } from '@koobiq/react-primitives';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Provider } from '../Provider';

import { FileUpload } from './index';
import type { FileUploadItem, FileUploadProps } from './index';
import { readDroppedFiles } from './utils';

const ROOT_TEST_ID = 'file-upload';

const makeFile = (name: string, content = 'stub') =>
  new File([content], name, { type: 'text/plain' });

const makeItem = (name: string, size?: number): FileUploadItem => ({
  id: name,
  size,
  file: makeFile(name),
});

const getFileInput = () =>
  document.querySelector('input[type="file"]') as HTMLInputElement;

const renderComponent = (props: FileUploadProps = {}) =>
  render(
    <FileUpload aria-label="upload" data-testid={ROOT_TEST_ID} {...props} />
  );

describe('FileUpload', () => {
  it('should accept a ref', () => {
    const ref = createRef<HTMLDivElement>();

    renderComponent({ ref });

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

  it('adds the selected file to the list (single)', async () => {
    const user = userEvent.setup();

    renderComponent();

    await user.upload(getFileInput(), makeFile('hello.txt'));

    expect(screen.getByText('hello.txt')).toBeInTheDocument();
    // in single mode the browse link is hidden once a file is selected
    expect(screen.queryByText('select a file')).not.toBeInTheDocument();
  });

  it('shows the file size when showFileSize is set', () => {
    renderComponent({
      showFileSize: true,
      defaultValue: [makeItem('report.pdf', 148909)],
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

  it('removes a file via the remove button and calls onRemove', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    renderComponent({
      onRemove,
      defaultValue: [makeItem('remove-me.txt')],
    });

    await user.click(screen.getByRole('button', { name: /remove/i }));

    expect(screen.queryByText('remove-me.txt')).not.toBeInTheDocument();
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('restores focus to the browse link after removing the last file', async () => {
    const user = userEvent.setup();

    renderComponent({ defaultValue: [makeItem('only.txt')] });

    await user.click(screen.getByRole('button', { name: /remove/i }));

    await waitFor(() => {
      expect(screen.getByText('select a file')).toHaveFocus();
    });
  });

  it('moves focus to the next file after removing a middle one', async () => {
    const user = userEvent.setup();

    renderComponent({
      allowsMultiple: true,
      defaultValue: [
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
      defaultValue: [
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
      defaultValue: [makeItem('remove-me.txt')],
    });

    const button = screen.getByRole('button', { name: /remove/i });

    button.focus();
    fireEvent.keyDown(button, { key: 'Delete' });

    expect(screen.queryByText('remove-me.txt')).not.toBeInTheDocument();
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('removes a file with the Backspace key when the remove button is focused', () => {
    const onRemove = vi.fn();

    renderComponent({
      onRemove,
      defaultValue: [makeItem('remove-me.txt')],
    });

    const button = screen.getByRole('button', { name: /remove/i });

    button.focus();
    fireEvent.keyDown(button, { key: 'Backspace' });

    expect(screen.queryByText('remove-me.txt')).not.toBeInTheDocument();
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('shows a determinate spinner and marks the row invalid/loading', () => {
    renderComponent({
      defaultValue: [
        { ...makeItem('loading.txt'), isLoading: true, progress: 42 },
      ],
    });

    const progress = screen.getByRole('progressbar');

    expect(progress).toHaveAttribute('aria-valuenow', '42');
    expect(screen.getByRole('listitem')).toHaveAttribute('data-loading');
  });

  it('shows an indeterminate spinner when progress is not set', () => {
    renderComponent({
      defaultValue: [{ ...makeItem('loading.txt'), isLoading: true }],
    });

    expect(screen.getByRole('progressbar')).not.toHaveAttribute(
      'aria-valuenow'
    );
  });

  it('marks the row invalid when errorMessage is set', () => {
    renderComponent({
      defaultValue: [
        { ...makeItem('bad.txt'), errorMessage: 'Something went wrong' },
      ],
    });

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('listitem')).toHaveAttribute('data-invalid');
  });

  it('supports controlled value with onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    function Controlled() {
      const [items, setItems] = useState<FileUploadItem[]>([]);

      return (
        <FileUpload
          allowsMultiple
          aria-label="upload"
          value={items}
          onChange={(next) => {
            onChange(next);
            setItems(next);
          }}
        />
      );
    }

    render(<Controlled />);

    await user.upload(getFileInput(), [makeFile('controlled.txt')]);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByText('controlled.txt')).toBeInTheDocument();
  });

  it('calls onAdd when files are added', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();

    renderComponent({ onAdd });

    await user.upload(getFileInput(), makeFile('added.txt'));

    expect(onAdd).toHaveBeenCalledTimes(1);
  });

  it('does not add files when disabled', async () => {
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

  it('supports explicit compound composition (uncontrolled)', async () => {
    const user = userEvent.setup();

    render(
      <FileUpload
        allowsMultiple
        aria-label="upload"
        defaultValue={[makeItem('a.txt')]}
      >
        <FileUpload.List />
        <FileUpload.Dropzone>
          <FileUpload.Trigger>browse</FileUpload.Trigger>
        </FileUpload.Dropzone>
      </FileUpload>
    );

    expect(screen.getByText('a.txt')).toBeInTheDocument();
    expect(screen.getByText('browse')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /remove/i }));

    expect(screen.queryByText('a.txt')).not.toBeInTheDocument();
  });

  it('forwards a ref on FileUpload.Item to its root element', () => {
    const ref = createRef<HTMLLIElement>();
    const item = makeItem('ref-item.txt');

    render(
      <FileUpload aria-label="upload">
        <FileUpload.List>
          <FileUpload.Item ref={ref} item={item} data-testid="item" />
        </FileUpload.List>
      </FileUpload>
    );

    expect(ref.current).toBe(screen.getByTestId('item'));
    expect(ref.current?.tagName).toBe('LI');
  });

  it('localizes strings via the Provider locale', () => {
    render(
      <Provider locale="ru-RU">
        <FileUpload aria-label="upload" />
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
