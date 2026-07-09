import { act, cleanup, render, renderHook } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { FileInput, FileUploadProvider } from './components';
import {
  showErrorOnDirty,
  showErrorOnSubmit,
  showErrorOnTouched,
} from './errorPredicates';
import { useFileList } from './hooks/useFileList';
import type { FileItem } from './types';
import { extractDroppedFiles, formatDataSize } from './utils';
import { isCorrectExtension, maxFileSize } from './validators';

afterEach(cleanup);

const getFileInput = (): HTMLInputElement =>
  document.querySelector('input[type="file"]') as HTMLInputElement;

// --- fake directory-entry helpers for drag-and-drop tests ---------------------

const fileEntry = (file: File, fullPath: string) => ({
  isFile: true,
  isDirectory: false,
  fullPath,
  file: (cb: (f: File) => void) => cb(file),
});

const dirEntry = (fullPath: string, children: unknown[]) => {
  let read = false;

  return {
    isFile: false,
    isDirectory: true,
    fullPath,
    createReader: () => ({
      readEntries: (resolve: (entries: unknown[]) => void) => {
        resolve(read ? [] : children);
        read = true;
      },
    }),
  };
};

const makeDataTransfer = (entries: unknown[]) =>
  ({
    items: entries.map((entry) => ({
      kind: 'file',
      webkitGetAsEntry: () => entry,
    })),
    files: [],
  }) as unknown as DataTransfer;

describe('useFileList', () => {
  it('add appends one item and emits added', () => {
    const onItemsAdded = vi.fn();

    const { result } = renderHook(() =>
      useFileList<number>({ defaultList: [], onItemsAdded })
    );

    act(() => result.current.add(1));

    expect(result.current.list).toEqual([1]);
    expect(onItemsAdded).toHaveBeenCalledWith([1]);
  });

  it('addArray appends many items', () => {
    const { result } = renderHook(() =>
      useFileList<number>({ defaultList: [1] })
    );

    act(() => result.current.addArray([2, 3]));

    expect(result.current.list).toEqual([1, 2, 3]);
  });

  it('remove drops the first match, returns survivors, emits no removal event', () => {
    const onItemRemoved = vi.fn();

    const { result } = renderHook(() =>
      useFileList<string>({ defaultList: ['a', 'b', 'a'], onItemRemoved })
    );

    let survivors: string[] = [];

    act(() => {
      survivors = result.current.remove('a');
    });

    expect(survivors).toEqual(['b', 'a']);
    expect(result.current.list).toEqual(['b', 'a']);
    expect(onItemRemoved).not.toHaveBeenCalled();
  });

  it('removeAt splices by index, emits the removal event, returns the removed item', () => {
    const onItemRemoved = vi.fn();

    const { result } = renderHook(() =>
      useFileList<string>({ defaultList: ['a', 'b', 'c'], onItemRemoved })
    );

    let removed: string | undefined;

    act(() => {
      removed = result.current.removeAt(1);
    });

    expect(removed).toBe('b');
    expect(result.current.list).toEqual(['a', 'c']);
    expect(onItemRemoved).toHaveBeenCalledWith('b', 1);
  });

  it('updateAt immutably patches the item at an index', () => {
    const { result } = renderHook(() =>
      useFileList<{ v: number }>({ defaultList: [{ v: 1 }, { v: 2 }] })
    );

    const before = result.current.list[0];

    act(() => result.current.updateAt(0, { v: 9 }));

    expect(result.current.list[0]).toEqual({ v: 9 });
    expect(result.current.list[0]).not.toBe(before);
  });
});

describe('validators', () => {
  it('maxFileSize fails over the limit and passes under it', () => {
    const file = new File(['x'.repeat(2000)], 'a.txt', { type: 'text/plain' });

    expect(maxFileSize(1000)(file)).toEqual({
      maxFileSize: { max: 1000, actual: 2000 },
    });

    expect(maxFileSize(5000)(file)).toBeNull();
  });

  it('isCorrectExtension matches extensions and MIME wildcards', () => {
    const png = new File([''], 'photo.PNG', { type: 'image/png' });

    expect(isCorrectExtension(['.png'])(png)).toBeNull();
    expect(isCorrectExtension(['image/*'])(png)).toBeNull();

    expect(isCorrectExtension(['.jpg'])(png)).toEqual({
      fileExtensionMismatch: { expected: ['.jpg'], actual: 'photo.PNG' },
    });
  });
});

describe('error predicates', () => {
  const base = {
    isInvalid: true,
    isTouched: false,
    isDirty: false,
    isSubmitted: false,
  };

  it('default shows on touched or submitted', () => {
    expect(showErrorOnTouched({ ...base, isTouched: true })).toBe(true);
    expect(showErrorOnTouched(base)).toBe(false);
  });

  it('on-submit shows only after submit', () => {
    expect(showErrorOnSubmit({ ...base, isTouched: true })).toBe(false);
    expect(showErrorOnSubmit({ ...base, isSubmitted: true })).toBe(true);
  });

  it('on-dirty shows when dirty', () => {
    expect(showErrorOnDirty({ ...base, isDirty: true })).toBe(true);
    expect(showErrorOnDirty(base)).toBe(false);
  });
});

describe('formatDataSize', () => {
  // The separator is a non-breaking space (U+00A0), matching KbqDataSizePipe.
  const NBSP = '\u00A0';

  it('formats bytes with the SI base (1000) and up to 2 fraction digits', () => {
    expect(formatDataSize(0, 'en-US')).toBe(`0${NBSP}B`);
    expect(formatDataSize(512, 'en-US')).toBe(`512${NBSP}B`);
    // Steps up at 1000 (SI), not 1024, and drops trailing zeros.
    expect(formatDataSize(1000, 'en-US')).toBe(`1${NBSP}KB`);
    expect(formatDataSize(1024, 'en-US')).toBe(`1.02${NBSP}KB`);
    expect(formatDataSize(1500, 'en-US')).toBe(`1.5${NBSP}KB`);
    expect(formatDataSize(1_500_000, 'en-US')).toBe(`1.5${NBSP}MB`);
  });

  it('localizes the unit labels and decimal separator for ru', () => {
    expect(formatDataSize(1024, 'ru-RU')).toBe(`1,02${NBSP}КБ`);
    expect(formatDataSize(1_500_000, 'ru-RU')).toBe(`1,5${NBSP}МБ`);
  });

  it('returns an empty string for non-finite input', () => {
    expect(formatDataSize(Number.NaN)).toBe('');
    expect(formatDataSize(Number.POSITIVE_INFINITY)).toBe('');
  });
});

describe('extractDroppedFiles', () => {
  it('recursively expands directories and stamps fullPath', async () => {
    const top = new File(['a'], 'a.txt');
    const nested = new File(['b'], 'b.txt');

    const files = await extractDroppedFiles(
      makeDataTransfer([
        fileEntry(top, '/a.txt'),
        dirEntry('/dir', [fileEntry(nested, '/dir/b.txt')]),
      ])
    );

    expect(files.map((f) => f.name).sort()).toEqual(['a.txt', 'b.txt']);
    expect(files.find((f) => f.name === 'b.txt')?.fullPath).toBe('/dir/b.txt');
  });
});

describe('useFileInput / FileInput', () => {
  it('maps attributes onto the hidden input', () => {
    render(
      <FileInput accept="image/*" multiple onChange={vi.fn()}>
        choose
      </FileInput>
    );

    const input = getFileInput();

    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('accept', 'image/*');
    expect(input).toHaveAttribute('multiple');
  });

  it('sets webkitdirectory when directory is requested', () => {
    render(
      <FileInput directory onChange={vi.fn()}>
        choose folder
      </FileInput>
    );

    expect(getFileInput()).toHaveAttribute('webkitdirectory');
  });

  it('gives context values precedence over local props', () => {
    render(
      <FileUploadProvider isDisabled>
        <FileInput onChange={vi.fn()}>choose</FileInput>
      </FileUploadProvider>
    );

    expect(getFileInput()).toBeDisabled();
  });

  it('resets the input value after each selection (same-file re-pick)', async () => {
    const onChange = vi.fn();

    render(<FileInput onChange={onChange}>choose</FileInput>);

    const input = getFileInput();

    await userEvent.upload(input, new File(['x'], 'x.txt'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(input.value).toBe('');
  });
});

// Guards the FileItem shape used across the suite.
export const sampleItem = (name: string): FileItem => ({
  file: new File(['x'], name),
  loading: false,
  progress: 0,
});
