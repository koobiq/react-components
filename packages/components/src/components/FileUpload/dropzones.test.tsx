import { useRef } from 'react';

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { LocalDropzone } from './components/LocalDropzone';
import { MultipleFileUpload } from './MultipleFileUpload';
import { SingleFileUpload } from './SingleFileUpload';
import type { FileUploadDropTarget } from './types';

afterEach(cleanup);

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

describe('FullScreenDropzone (via fullScreenDropzone prop)', () => {
  it('does not open when not enabled', () => {
    render(<MultipleFileUpload />);

    fireEvent.dragEnter(document.body);

    expect(screen.queryByText('Drop anywhere')).not.toBeInTheDocument();
  });

  it('opens on document drag, adds on drop, then closes', async () => {
    const onChange = vi.fn();

    render(
      <MultipleFileUpload
        fullScreenDropzone={{ title: 'Drop anywhere' }}
        onChange={onChange}
      />
    );

    expect(screen.queryByText('Drop anywhere')).not.toBeInTheDocument();

    fireEvent.dragEnter(document.body);
    expect(screen.getByText('Drop anywhere')).toBeInTheDocument();

    fireEvent.drop(document.body, {
      dataTransfer: dataTransferWith([new File(['a'], 'a.txt')]),
    });

    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls.at(-1)?.[0]).toHaveLength(1);

    await waitFor(() =>
      expect(screen.queryByText('Drop anywhere')).not.toBeInTheDocument()
    );
  });

  it('uses the localized default title when no config title is given', () => {
    render(<SingleFileUpload fullScreenDropzone />);

    fireEvent.dragEnter(document.body);

    // The single empty-state caption is "Drag here or …" (a different node);
    // the overlay title is exactly "Drag here".
    expect(screen.getByText('Drag here')).toBeInTheDocument();
  });

  it('does not open while disabled', () => {
    render(
      <MultipleFileUpload
        isDisabled
        fullScreenDropzone={{ title: 'Drop anywhere' }}
      />
    );

    fireEvent.dragEnter(document.body);

    expect(screen.queryByText('Drop anywhere')).not.toBeInTheDocument();
  });
});

describe('LocalDropzone', () => {
  const Harness = ({ onChange }: { onChange: (v: unknown) => void }) => {
    const ref = useRef<FileUploadDropTarget>(null);

    return (
      <>
        <MultipleFileUpload dropTargetRef={ref} onChange={onChange} />
        <LocalDropzone
          connectedTo={ref}
          config={{ title: 'Drop here' }}
          className="local-host"
        >
          <div>Host region</div>
        </LocalDropzone>
      </>
    );
  };

  const getHost = (container: HTMLElement): HTMLElement =>
    container.querySelector('.local-host') as HTMLElement;

  const getOverlay = (): HTMLElement =>
    document.querySelector('[class*="overlay"]') as HTMLElement;

  it('opens an overlay over the host on drag enter', () => {
    const { container } = render(<Harness onChange={vi.fn()} />);

    expect(screen.queryByText('Drop here')).not.toBeInTheDocument();

    fireEvent.dragEnter(getHost(container));

    expect(screen.getByText('Drop here')).toBeInTheDocument();
  });

  it('routes a drop to the connected component', async () => {
    const onChange = vi.fn();
    const { container } = render(<Harness onChange={onChange} />);

    fireEvent.dragEnter(getHost(container));

    fireEvent.drop(getOverlay(), {
      dataTransfer: dataTransferWith([new File(['a'], 'a.txt')]),
    });

    await waitFor(() => expect(onChange).toHaveBeenCalled());
    expect(onChange.mock.calls.at(-1)?.[0]).toHaveLength(1);
  });

  it('closes when the drag leaves the host', async () => {
    const { container } = render(<Harness onChange={vi.fn()} />);

    fireEvent.dragEnter(getHost(container));
    expect(screen.getByText('Drop here')).toBeInTheDocument();

    getOverlay().dispatchEvent(
      new MouseEvent('dragleave', {
        bubbles: true,
        relatedTarget: document.body,
      })
    );

    await waitFor(() =>
      expect(screen.queryByText('Drop here')).not.toBeInTheDocument()
    );
  });
});
