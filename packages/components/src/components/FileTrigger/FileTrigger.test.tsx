import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from '../Button';
import { Link } from '../Link';

import { FileTrigger } from './index';
import type { FileTriggerRef } from './index';

const makeFile = (name: string, type = 'text/plain') =>
  new File(['stub'], name, { type });

const getFileInput = () =>
  document.querySelector('input[type="file"]') as HTMLInputElement;

const spyOnFileDialog = () =>
  vi.spyOn(getFileInput(), 'click').mockImplementation(() => undefined);

describe('FileTrigger', () => {
  const baseProps = { 'data-testid': 'file-trigger' };

  it('should render the trigger and a hidden file input', () => {
    const { container } = render(
      <FileTrigger {...baseProps}>
        <Button>Choose</Button>
      </FileTrigger>
    );

    const input = getFileInput();

    expect(container).toContainElement(screen.getByRole('button'));
    expect(input).toBeInTheDocument();
    expect(input).toHaveStyle({ display: 'none' });
    expect(screen.getByTestId('file-trigger')).toBe(input);
  });

  it('should accept the ref pointing to the file input', () => {
    const ref = createRef<FileTriggerRef>();

    render(
      <FileTrigger {...baseProps} ref={ref}>
        <Button>Choose</Button>
      </FileTrigger>
    );

    expect(ref.current).toBe(getFileInput());
  });

  it('should call onSelect with the selected files', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn<(files: FileList | null) => void>();
    const file = makeFile('hello.txt');

    render(
      <FileTrigger {...baseProps} onSelect={onSelect}>
        <Button>Choose</Button>
      </FileTrigger>
    );

    await user.upload(getFileInput(), file);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(Array.from(onSelect.mock.lastCall?.[0] ?? [])).toEqual([file]);
  });

  it('should map accept to the accept attribute', () => {
    render(
      <FileTrigger {...baseProps} accept={['image/*', '.pdf']}>
        <Button>Choose</Button>
      </FileTrigger>
    );

    expect(getFileInput()).toHaveAttribute('accept', 'image/*,.pdf');
  });

  it('should allow selecting several files with allowsMultiple', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn<(files: FileList | null) => void>();
    const files = [makeFile('a.txt'), makeFile('b.txt')];

    render(
      <FileTrigger {...baseProps} allowsMultiple onSelect={onSelect}>
        <Button>Choose</Button>
      </FileTrigger>
    );

    expect(getFileInput()).toHaveAttribute('multiple');

    await user.upload(getFileInput(), files);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(Array.from(onSelect.mock.lastCall?.[0] ?? [])).toEqual(files);
  });

  it('should map acceptDirectory to the webkitdirectory attribute', () => {
    render(
      <FileTrigger {...baseProps} acceptDirectory>
        <Button>Choose</Button>
      </FileTrigger>
    );

    expect(getFileInput()).toHaveAttribute('webkitdirectory');
  });

  it('should map defaultCamera to the capture attribute', () => {
    render(
      <FileTrigger {...baseProps} defaultCamera="environment">
        <Button>Choose</Button>
      </FileTrigger>
    );

    expect(getFileInput()).toHaveAttribute('capture', 'environment');
  });

  it('should open the file dialog on press and keep the trigger handler', async () => {
    const user = userEvent.setup();
    const onPress = vi.fn();

    render(
      <FileTrigger {...baseProps}>
        <Button onPress={onPress}>Choose</Button>
      </FileTrigger>
    );

    const click = spyOnFileDialog();

    await user.click(screen.getByRole('button'));

    expect(click).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should open the file dialog from the keyboard', async () => {
    const user = userEvent.setup();

    render(
      <FileTrigger {...baseProps}>
        <Button>Choose</Button>
      </FileTrigger>
    );

    const click = spyOnFileDialog();

    await user.tab();
    await user.keyboard('{Enter}');

    expect(click).toHaveBeenCalledTimes(1);
  });

  it('should not open the file dialog with a disabled trigger', async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <FileTrigger {...baseProps}>
        <Button isDisabled>Choose</Button>
      </FileTrigger>
    );

    const click = spyOnFileDialog();

    await user.click(screen.getByRole('button'));

    expect(click).not.toHaveBeenCalled();

    rerender(
      <FileTrigger {...baseProps}>
        <Button>Choose</Button>
      </FileTrigger>
    );

    await user.click(screen.getByRole('button'));

    expect(click).toHaveBeenCalledTimes(1);
  });

  it('should open the file dialog from a link trigger', async () => {
    const user = userEvent.setup();

    render(
      <FileTrigger {...baseProps}>
        <Link isPseudo>Choose</Link>
      </FileTrigger>
    );

    const click = spyOnFileDialog();

    await user.click(screen.getByText('Choose'));

    expect(click).toHaveBeenCalledTimes(1);
  });
});
