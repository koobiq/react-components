import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SingleFileUpload } from './SingleFileUpload';
import type { FileItem } from './types';

afterEach(cleanup);

const makeItem = (name = 'document.txt'): FileItem => ({
  file: new File(['hello world'], name, { type: 'text/plain' }),
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

describe('SingleFileUpload', () => {
  it('renders an empty state with a browse link', () => {
    render(<SingleFileUpload />);

    expect(screen.getByText('choose')).toBeInTheDocument();
    expect(getFileInput()).toBeInTheDocument();
  });

  it('selects a file and emits change', async () => {
    const onChange = vi.fn();

    render(<SingleFileUpload onChange={onChange} />);

    const file = new File(['hi'], 'hi.txt', { type: 'text/plain' });

    await userEvent.upload(getFileInput(), file);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]?.[0]?.file).toBe(file);
    expect(screen.getByLabelText('hi.txt')).toBeInTheDocument();
  });

  it('replaces the file when a new one is dropped', async () => {
    const { container } = render(
      <SingleFileUpload defaultValue={makeItem('first.txt')} />
    );

    expect(screen.getByLabelText('first.txt')).toBeInTheDocument();

    fireEvent.drop(getDropArea(container), {
      dataTransfer: dataTransferWith([new File(['x'], 'second.txt')]),
    });

    await waitFor(() =>
      expect(screen.getByLabelText('second.txt')).toBeInTheDocument()
    );

    expect(screen.queryByLabelText('first.txt')).not.toBeInTheDocument();
  });

  it('clears the value on remove and returns focus to the input', async () => {
    const onChange = vi.fn();
    const onFileRemoved = vi.fn();

    render(
      <SingleFileUpload
        defaultValue={makeItem()}
        onChange={onChange}
        onFileRemoved={onFileRemoved}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: /remove/i }));

    expect(onChange).toHaveBeenLastCalledWith(null);
    expect(onFileRemoved).toHaveBeenCalledTimes(1);
    expect(screen.getByText('choose')).toBeInTheDocument();

    await waitFor(() => expect(getFileInput()).toHaveFocus());
  });

  it('adds a dropped file (accept is not enforced on drop)', async () => {
    const onChange = vi.fn();

    const { container } = render(
      <SingleFileUpload accept={['.png']} onChange={onChange} />
    );

    const disallowed = new File(['x'], 'notes.txt', { type: 'text/plain' });

    fireEvent.drop(getDropArea(container), {
      dataTransfer: dataTransferWith([disallowed]),
    });

    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls[0]?.[0]?.file.name).toBe('notes.txt');
  });

  it('toggles the drag-over attribute without clearing on descendant leave', () => {
    const { container } = render(<SingleFileUpload />);
    const dropArea = getDropArea(container);

    fireEvent.dragEnter(dropArea);
    expect(dropArea).toHaveAttribute('data-dragover');

    // jsdom drops `relatedTarget` on synthetic DragEvents, so dispatch a
    // MouseEvent (which carries it) to exercise the descendant guard.
    const dragLeave = (relatedTarget: Node | null) =>
      dropArea.dispatchEvent(
        new MouseEvent('dragleave', { bubbles: true, relatedTarget })
      );

    // Leaving onto a descendant keeps the highlight.
    const descendant = dropArea.querySelector('span') ?? dropArea;

    dragLeave(descendant);
    expect(dropArea).toHaveAttribute('data-dragover');

    // Leaving the target clears it.
    dragLeave(document.body);
    expect(dropArea).not.toHaveAttribute('data-dragover');
  });

  it('is disabled: input disabled and drops are ignored', () => {
    const onChange = vi.fn();

    const { container } = render(
      <SingleFileUpload isDisabled onChange={onChange} />
    );

    expect(getFileInput()).toBeDisabled();

    fireEvent.drop(getDropArea(container), {
      dataTransfer: dataTransferWith([new File(['x'], 'x.txt')]),
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows the error message and invalid styling when the predicate allows it', () => {
    const { container } = render(
      <SingleFileUpload
        defaultValue={makeItem()}
        isInvalid
        errorMessage="Something is wrong"
        shouldShowError={() => true}
      />
    );

    expect(screen.getByText('Something is wrong')).toBeInTheDocument();
    expect(getDropArea(container)).toHaveAttribute('data-invalid');
  });

  it('hides the file size when showFileSize is false', () => {
    render(<SingleFileUpload defaultValue={makeItem()} showFileSize={false} />);

    expect(screen.queryByText(/\bB\b/)).not.toBeInTheDocument();
  });

  it('renders a controlled value and does not throw during SSR', async () => {
    const { renderToString } = await import('react-dom/server');

    expect(() =>
      renderToString(<SingleFileUpload value={makeItem()} onChange={vi.fn()} />)
    ).not.toThrow();
  });
});
