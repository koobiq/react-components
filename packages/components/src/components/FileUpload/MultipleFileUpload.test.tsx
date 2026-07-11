import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { MultipleFileUpload } from './MultipleFileUpload';
import type { FileItem } from './types';

afterEach(cleanup);

const makeItem = (name: string): FileItem => ({
  file: new File(['content'], name, { type: 'text/plain' }),
  loading: false,
  progress: 0,
});

const getFileInput = (): HTMLInputElement =>
  document.querySelector('input[type="file"]') as HTMLInputElement;

const getDropArea = (container: HTMLElement): HTMLElement =>
  container.querySelector('[class*="dropArea"]') as HTMLElement;

const dataTransferWith = (files: File[]) =>
  ({
    items: files.map((file) => ({
      kind: 'file',
      webkitGetAsEntry: () => ({
        isFile: true,
        isDirectory: false,
        fullPath: `/${file.name}`,
        file: (cb: (f: File) => void) => cb(file),
      }),
    })),
    files,
  }) as unknown as DataTransfer;

describe('MultipleFileUpload', () => {
  it('appends selected files and emits change + added', async () => {
    const onChange = vi.fn();
    const onFilesAdded = vi.fn();

    render(
      <MultipleFileUpload onChange={onChange} onFilesAdded={onFilesAdded} />
    );

    const a = new File(['a'], 'a.txt');
    const b = new File(['b'], 'b.txt');

    await userEvent.upload(getFileInput(), [a, b]);

    expect(onChange.mock.calls.at(-1)?.[0]).toHaveLength(2);
    expect(onFilesAdded.mock.calls.at(-1)?.[0]).toHaveLength(2);
    expect(screen.getByLabelText('a.txt')).toBeInTheDocument();
    expect(screen.getByLabelText('b.txt')).toBeInTheDocument();
  });

  it('exposes list and listitem semantics', () => {
    render(
      <MultipleFileUpload
        defaultValue={[makeItem('a.txt'), makeItem('b.txt')]}
      />
    );

    const list = screen.getByRole('list');

    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
  });

  it('allows duplicates and re-selecting the same file', async () => {
    const onChange = vi.fn();

    render(<MultipleFileUpload onChange={onChange} />);

    const file = new File(['a'], 'a.txt');

    await userEvent.upload(getFileInput(), file);
    // The footer browse input persists once files exist.
    await userEvent.upload(getFileInput(), file);

    expect(onChange.mock.calls.at(-1)?.[0]).toHaveLength(2);
  });

  it('removes by index and emits the removed item and index', async () => {
    const onFileRemoved = vi.fn();
    const first = makeItem('a.txt');
    const second = makeItem('b.txt');

    render(
      <MultipleFileUpload
        defaultValue={[first, second]}
        onFileRemoved={onFileRemoved}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });

    await userEvent.click(removeButtons[0]!);

    expect(onFileRemoved).toHaveBeenCalledWith(first, 0);
    expect(screen.queryByLabelText('a.txt')).not.toBeInTheDocument();
    expect(screen.getByLabelText('b.txt')).toBeInTheDocument();
  });

  it('removes the focused row with the Delete key', async () => {
    const onFileRemoved = vi.fn();
    const first = makeItem('a.txt');

    render(
      <MultipleFileUpload
        defaultValue={[first, makeItem('b.txt')]}
        onFileRemoved={onFileRemoved}
      />
    );

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });

    removeButtons[0]!.focus();
    await userEvent.keyboard('{Delete}');

    expect(onFileRemoved).toHaveBeenCalledWith(first, 0);
  });

  it('appends all dropped files', async () => {
    const onChange = vi.fn();
    const { container } = render(<MultipleFileUpload onChange={onChange} />);

    fireEvent.drop(getDropArea(container), {
      dataTransfer: dataTransferWith([
        new File(['a'], 'a.txt'),
        new File(['b'], 'b.txt'),
      ]),
    });

    await waitFor(() =>
      expect(onChange.mock.calls.at(-1)?.[0]).toHaveLength(2)
    );
  });

  it('renders a compact empty state', () => {
    const { container } = render(<MultipleFileUpload size="compact" />);

    expect(getDropArea(container)).toHaveAttribute('data-size', 'compact');
    expect(screen.getByText('choose files')).toBeInTheDocument();
  });

  it('is disabled: input disabled and drops ignored', () => {
    const onChange = vi.fn();

    const { container } = render(
      <MultipleFileUpload isDisabled onChange={onChange} />
    );

    expect(getFileInput()).toBeDisabled();

    fireEvent.drop(getDropArea(container), {
      dataTransfer: dataTransferWith([new File(['x'], 'x.txt')]),
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('always shows the file size in rows', () => {
    render(<MultipleFileUpload defaultValue={[makeItem('a.txt')]} />);

    expect(screen.getByText(/\bB\b/)).toBeInTheDocument();
  });
});
