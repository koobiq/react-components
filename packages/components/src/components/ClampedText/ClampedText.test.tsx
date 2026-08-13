import { createRef, type SVGProps } from 'react';

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Provider } from '../Provider';
import { Typography } from '../Typography';

import { ClampedText } from './ClampedText';

vi.mock('@koobiq/react-icons', () => ({
  IconChevronDown16: (props: SVGProps<SVGSVGElement>) => (
    <svg data-testid="expand-icon" {...props} />
  ),
  IconChevronUp16: (props: SVGProps<SVGSVGElement>) => (
    <svg data-testid="collapse-icon" {...props} />
  ),
}));

const createResizeEntry = (width: number): ResizeObserverEntry =>
  ({
    contentRect: {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: width,
      bottom: 100,
      width,
      height: 100,
    },
    borderBoxSize: [{ inlineSize: width, blockSize: 100 }],
  }) as unknown as ResizeObserverEntry;

const createClientRects = (tops: number[]): DOMRectList => {
  const rects = tops.map(
    (top) =>
      ({
        x: 0,
        y: top,
        top,
        left: 0,
        right: 100,
        bottom: top + 20,
        width: 100,
        height: 20,
        toJSON: () => ({}),
      }) as DOMRect
  );

  return Object.assign(rects, {
    item: (index: number) => rects[index] ?? null,
  }) as DOMRectList;
};

describe('ClampedText', () => {
  let resize: ResizeObserverCallback;
  let rowTops: number[];
  const observe = vi.fn();
  const disconnect = vi.fn();
  const scrollIntoView = vi.fn();
  const selectNodeContents = vi.fn();

  beforeEach(() => {
    rowTops = [];

    class ResizeObserverMock {
      constructor(callback: ResizeObserverCallback) {
        resize = callback;
      }

      observe = observe;
      disconnect = disconnect;
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);

      return 1;
    });

    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    vi.spyOn(document, 'createRange').mockReturnValue({
      selectNodeContents,
      getClientRects: () => createClientRects(rowTops),
    } as unknown as Range);

    Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
      configurable: true,
      value: scrollIntoView,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.clearAllMocks();
    Reflect.deleteProperty(HTMLElement.prototype, 'scrollIntoView');
  });

  it('forwards the ref and root element props', () => {
    const ref = createRef<HTMLDivElement>();

    render(
      <ClampedText
        ref={ref}
        data-testid="root"
        className="custom"
        style={{ padding: 4 }}
      >
        Text
      </ClampedText>
    );

    expect(ref.current).toBe(screen.getByTestId('root'));
    expect(ref.current).toHaveClass('custom');
    expect(ref.current).toHaveStyle({ padding: '4px' });
  });

  it('supports custom labels and content and toggle slot props', async () => {
    rowTops = [0, 20, 40, 60];
    const contentRef = createRef<HTMLDivElement>();
    const toggleRef = createRef<HTMLButtonElement>();
    const onContentClick = vi.fn();
    const onTogglePress = vi.fn();
    const user = userEvent.setup();

    render(
      <ClampedText
        id="custom-root"
        rows={2}
        moreText={<span>Show full text</span>}
        lessText={<span>Show less text</span>}
        data-testid="root"
        slotProps={{
          content: {
            id: 'custom-content',
            ref: contentRef,
            className: 'custom-content',
            style: { color: 'red' },
            onClick: onContentClick,
          },
          toggle: {
            ref: toggleRef,
            className: 'custom-toggle',
            style: { color: 'blue' },
            'data-testid': 'toggle',
            onPress: onTogglePress,
          },
        }}
      >
        Long text
      </ClampedText>
    );

    const root = screen.getByTestId('root');
    const content = contentRef.current!;
    const toggle = screen.getByTestId('toggle');

    expect(root).toHaveAttribute('id', 'custom-root');
    expect(content).toHaveAttribute('id', 'custom-content');
    expect(content).toHaveClass('custom-content');
    expect(content.style.color).toBe('red');
    expect(content.style.getPropertyValue('--clamped-text-rows')).toBe('2');

    expect(toggleRef.current).toBe(toggle);
    expect(toggle).toHaveClass('custom-toggle');
    expect(toggle.style.color).toBe('blue');
    expect(toggle).toHaveAttribute('aria-controls', 'custom-content');
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(toggle).toHaveAccessibleName('Show full text');

    fireEvent.click(content);
    expect(onContentClick).toHaveBeenCalledTimes(1);

    await user.click(toggle);

    expect(onTogglePress).toHaveBeenCalledTimes(1);
    expect(toggle).toHaveAccessibleName('Show less text');
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders on the server without browser measurement APIs', () => {
    const documentDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      'document'
    );

    Object.defineProperty(globalThis, 'document', {
      configurable: true,
      value: undefined,
    });

    vi.stubGlobal('Range', undefined);
    vi.stubGlobal('ResizeObserver', undefined);

    try {
      const html = renderToString(
        <ClampedText
          id="server-root"
          slotProps={{ content: { id: 'server-content' } }}
        >
          Server text
        </ClampedText>
      );

      expect(html).toContain('id="server-root"');
      expect(html).toContain('id="server-content"');
      expect(html).toContain('Server text');
      expect(html).toContain('data-clamped="true"');
      expect(html).toContain('--clamped-text-rows:6');
      expect(html).not.toContain('<button');

      const expandedHtml = renderToString(
        <ClampedText rows={2} defaultExpanded>
          Expanded server text
        </ClampedText>
      );

      expect(expandedHtml).toContain('data-expanded="true"');
      expect(expandedHtml).toContain('--clamped-text-rows:2');
      expect(expandedHtml).not.toContain('data-clamped');
    } finally {
      if (documentDescriptor) {
        Object.defineProperty(globalThis, 'document', documentDescriptor);
      }
    }
  });

  it('hydrates the server markup without a mismatch', async () => {
    rowTops = [0, 20, 40, 60];

    const element = (
      <ClampedText rows={2} slotProps={{ content: { id: 'content' } }}>
        Long text
      </ClampedText>
    );

    const container = document.createElement('div');

    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    container.innerHTML = renderToString(element);
    document.body.append(container);

    expect(container.firstElementChild).toHaveAttribute('data-clamped');

    expect(container.querySelector('#content')).toHaveStyle(
      '--clamped-text-rows: 3'
    );

    expect(container.querySelector('button')).not.toBeInTheDocument();

    const root = hydrateRoot(container, element);

    await act(async () => {});

    expect(consoleError).not.toHaveBeenCalled();

    expect(container.querySelector('#content')).toHaveStyle(
      '--clamped-text-rows: 2'
    );

    expect(container.querySelector('button')).toHaveAccessibleName('Expand');

    act(() => root.unmount());
    container.remove();
  });

  it('shows rows + 1 lines without a toggle or change event', () => {
    rowTops = [0, 20, 40, 60, 80, 100];
    const onExpandedChange = vi.fn();

    render(
      <ClampedText data-testid="root" onExpandedChange={onExpandedChange}>
        Text
      </ClampedText>
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByTestId('root')).not.toHaveAttribute('data-clamped');
    expect(onExpandedChange).not.toHaveBeenCalled();
  });

  it('counts equal top positions as one row', () => {
    rowTops = [0, 0, 20, 40, 60, 80, 100];

    render(<ClampedText>Text with inline fragments</ClampedText>);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('measures text across block children without an inline wrapper', () => {
    rowTops = [0, 20, 40, 60];

    render(
      <ClampedText rows={2} data-testid="root">
        <Typography as="h3" variant="title">
          Heading
        </Typography>
        <Typography>Paragraph text</Typography>
      </ClampedText>
    );

    const content = screen.getByTestId('root').firstElementChild as HTMLElement;

    expect(content.children).toHaveLength(2);
    expect(content.children[0].tagName).toBe('H3');
    expect(content.children[1].tagName).toBe('P');

    expect(selectNodeContents).toHaveBeenCalledWith(
      screen.getByText('Heading').firstChild
    );

    expect(selectNodeContents).toHaveBeenCalledWith(
      screen.getByText('Paragraph text').firstChild
    );

    expect(screen.getByRole('button', { name: 'Expand' })).toBeInTheDocument();
  });

  it('auto-collapses without a change event when rows exceed rows + 1', () => {
    rowTops = [0, 20, 40, 60, 80, 100, 120];
    const onExpandedChange = vi.fn();

    render(
      <ClampedText data-testid="root" onExpandedChange={onExpandedChange}>
        Long text
      </ClampedText>
    );

    const root = screen.getByTestId('root');
    const button = screen.getByRole('button', { name: 'Expand' });
    const content = root.firstElementChild as HTMLElement;

    expect(root).toHaveAttribute('data-overflowing');
    expect(root).toHaveAttribute('data-clamped');
    expect(content.style.getPropertyValue('--clamped-text-rows')).toBe('5');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', content.id);
    expect(screen.getByTestId('expand-icon')).toBeInTheDocument();
    expect(onExpandedChange).not.toHaveBeenCalled();
  });

  it('uses the custom rows value as the clamp', () => {
    rowTops = [0, 20, 40, 60];

    render(
      <ClampedText rows={2} data-testid="root">
        Long text
      </ClampedText>
    );

    const content = screen.getByTestId('root').firstElementChild as HTMLElement;

    expect(screen.getByRole('button', { name: 'Expand' })).toBeInTheDocument();
    expect(content.style.getPropertyValue('--clamped-text-rows')).toBe('2');
  });

  it('supports an initially expanded uncontrolled state', () => {
    rowTops = [0, 20, 40, 60];

    render(
      <ClampedText rows={2} defaultExpanded data-testid="root">
        Long text
      </ClampedText>
    );

    expect(screen.getByTestId('root')).not.toHaveAttribute('data-clamped');

    expect(screen.getByRole('button', { name: 'Collapse' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('supports keyboard toggling and scrolls into view after collapsing', async () => {
    rowTops = [0, 20, 40, 60];
    const onExpandedChange = vi.fn();
    const user = userEvent.setup();

    render(
      <ClampedText rows={2} onExpandedChange={onExpandedChange}>
        Long text
      </ClampedText>
    );

    await user.tab();
    await user.keyboard('{Enter}');

    expect(screen.getByRole('button', { name: 'Collapse' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    expect(screen.getByTestId('collapse-icon')).toBeInTheDocument();

    await user.keyboard(' ');

    expect(screen.getByRole('button', { name: 'Expand' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );

    expect(onExpandedChange.mock.calls.map(([value]) => value)).toEqual([
      true,
      false,
    ]);

    await waitFor(() => expect(scrollIntoView).toHaveBeenCalledTimes(1));

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  });

  it('supports controlled expansion', async () => {
    rowTops = [0, 20, 40, 60];
    const onExpandedChange = vi.fn();
    const user = userEvent.setup();

    const { rerender } = render(
      <ClampedText
        rows={2}
        isExpanded={false}
        onExpandedChange={onExpandedChange}
      >
        Long text
      </ClampedText>
    );

    await user.click(screen.getByRole('button', { name: 'Expand' }));

    expect(onExpandedChange).toHaveBeenLastCalledWith(true);

    expect(screen.getByRole('button', { name: 'Expand' })).toHaveAttribute(
      'aria-expanded',
      'false'
    );

    rerender(
      <ClampedText rows={2} isExpanded onExpandedChange={onExpandedChange}>
        Long text
      </ClampedText>
    );

    expect(screen.getByRole('button', { name: 'Collapse' })).toHaveAttribute(
      'aria-expanded',
      'true'
    );

    expect(onExpandedChange).toHaveBeenCalledTimes(1);
  });

  it('preserves the toggle preference across resize changes', async () => {
    rowTops = [0, 20, 40, 60];
    const onExpandedChange = vi.fn();
    const user = userEvent.setup();

    render(
      <ClampedText rows={2} onExpandedChange={onExpandedChange}>
        Long text
      </ClampedText>
    );

    await user.click(screen.getByRole('button', { name: 'Expand' }));

    rowTops = [0, 20, 40];
    act(() => resize([createResizeEntry(400)], {} as ResizeObserver));

    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rowTops = [0, 20, 40, 60];
    act(() => resize([createResizeEntry(200)], {} as ResizeObserver));

    expect(
      screen.getByRole('button', { name: 'Collapse' })
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Collapse' }));

    rowTops = [0, 20, 40];
    act(() => resize([createResizeEntry(400)], {} as ResizeObserver));
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rowTops = [0, 20, 40, 60];
    act(() => resize([createResizeEntry(200)], {} as ResizeObserver));

    expect(screen.getByRole('button', { name: 'Expand' })).toBeInTheDocument();

    expect(onExpandedChange.mock.calls.map(([value]) => value)).toEqual([
      true,
      false,
    ]);
  });

  it('remeasures when the content changes', () => {
    rowTops = [0, 20, 40];
    const { rerender } = render(<ClampedText rows={2}>Short text</ClampedText>);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rowTops = [0, 20, 40, 60];
    rerender(<ClampedText rows={2}>Long replacement text</ClampedText>);

    expect(screen.getByRole('button', { name: 'Expand' })).toBeInTheDocument();
  });

  it('uses localized toggle labels', () => {
    rowTops = [0, 20, 40, 60];

    render(
      <Provider locale="ru-RU">
        <ClampedText rows={2}>Длинный текст</ClampedText>
      </Provider>
    );

    expect(
      screen.getByRole('button', { name: 'Развернуть' })
    ).toBeInTheDocument();
  });
});
