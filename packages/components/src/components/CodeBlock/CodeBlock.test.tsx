import { createRef } from 'react';

import { once } from '@koobiq/logger';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import type { HLJSApi } from 'highlight.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CodeBlock } from './CodeBlock';
import { CodeBlockHighlightConfigProvider } from './context';
import type { CodeBlockHighlightConfig } from './context';
import type { CodeBlockFile, CodeBlockRef } from './types';

const createResizeEntry = (height: number): ResizeObserverEntry =>
  ({
    contentRect: {
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 300,
      bottom: height,
      width: 300,
      height,
    },
    borderBoxSize: [{ inlineSize: 300, blockSize: height }],
  }) as unknown as ResizeObserverEntry;

afterEach(() => {
  once.clear();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('CodeBlock', () => {
  const user = userEvent.setup({ delay: 0 });

  const jsFile: CodeBlockFile[] = [
    { content: 'const answer = 42;', language: 'javascript' },
  ];

  const multiFile: CodeBlockFile[] = [
    { content: '<div></div>', language: 'xml', filename: 'index.html' },
    {
      content: 'const answer = 42;',
      language: 'javascript',
      filename: 'main.ts',
    },
  ];

  const getCode = () => document.querySelector('code[data-language]');

  // jsdom doesn't implement scrolling.
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    value() {},
    writable: true,
  });

  it('highlights the active file content', async () => {
    render(<CodeBlock files={jsFile} data-testid="root" />);

    await waitFor(() =>
      expect(getCode()).toHaveAttribute('data-language', 'javascript')
    );

    expect(getCode()?.textContent).toBe('const answer = 42;');
    expect(document.querySelector('.hljs-keyword')).toHaveTextContent('const');
  });

  it('hides tabs automatically for a single file without a filename', async () => {
    const onHideTabsChange = vi.fn();

    render(
      <CodeBlock
        files={jsFile}
        onHideTabsChange={onHideTabsChange}
        data-testid="root"
      />
    );

    await waitFor(() => expect(getCode()).not.toBeNull());

    expect(screen.queryAllByRole('tab')).toHaveLength(0);
    expect(screen.getByTestId('root')).toHaveAttribute('data-hide-tabs');
    expect(onHideTabsChange).toHaveBeenCalledWith(true);
  });

  it('shows tabs again when files no longer require automatic hiding', async () => {
    const onHideTabsChange = vi.fn();

    const { rerender } = render(
      <CodeBlock
        files={jsFile}
        onHideTabsChange={onHideTabsChange}
        data-testid="root"
      />
    );

    await waitFor(() =>
      expect(onHideTabsChange).toHaveBeenLastCalledWith(true)
    );

    rerender(
      <CodeBlock
        files={multiFile}
        onHideTabsChange={onHideTabsChange}
        data-testid="root"
      />
    );

    await waitFor(() => expect(screen.getAllByRole('tab')).toHaveLength(2));

    expect(screen.getByTestId('root')).not.toHaveAttribute('data-hide-tabs');
    expect(onHideTabsChange).toHaveBeenLastCalledWith(false);
    expect(onHideTabsChange).toHaveBeenCalledTimes(2);
  });

  it('preserves defaultHideTabs when the file list changes', async () => {
    const onHideTabsChange = vi.fn();

    const { rerender } = render(
      <CodeBlock
        files={jsFile}
        defaultHideTabs
        onHideTabsChange={onHideTabsChange}
        data-testid="root"
      />
    );

    await waitFor(() => expect(getCode()).not.toBeNull());

    rerender(
      <CodeBlock
        files={multiFile}
        defaultHideTabs
        onHideTabsChange={onHideTabsChange}
        data-testid="root"
      />
    );

    expect(screen.queryAllByRole('tab')).toHaveLength(0);
    expect(screen.getByTestId('root')).toHaveAttribute('data-hide-tabs');
    expect(onHideTabsChange).not.toHaveBeenCalled();
  });

  it('shows one tab per file and switches the active file on click', async () => {
    const onActiveFileIndexChange = vi.fn();

    render(
      <CodeBlock
        files={multiFile}
        onActiveFileIndexChange={onActiveFileIndexChange}
      />
    );

    await waitFor(() =>
      expect(getCode()).toHaveAttribute('data-language', 'xml')
    );

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(2);
    expect(tabs[0]).toHaveTextContent('index.html');
    expect(tabs[1]).toHaveTextContent('main.ts');

    const panel = screen.getByRole('tabpanel');

    expect(tabs[0]).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', tabs[0]!.id);

    await user.click(tabs[1]!);

    expect(onActiveFileIndexChange).toHaveBeenCalledWith(1);

    await waitFor(() =>
      expect(getCode()).toHaveAttribute('data-language', 'javascript')
    );

    expect(screen.getByRole('tabpanel')).toHaveAttribute(
      'aria-labelledby',
      tabs[1]!.id
    );
  });

  it('renders a custom tab label via renderTabLabel', async () => {
    render(
      <CodeBlock
        files={multiFile}
        renderTabLabel={(file, fallback) =>
          `Custom: ${file.filename ?? fallback}`
        }
      />
    );

    expect(await screen.findByText('Custom: index.html')).toBeInTheDocument();
  });

  it('renders a single custom tab label as a standard selected tab', async () => {
    render(
      <CodeBlock
        files={jsFile}
        hideTabs={false}
        renderTabLabel={() => 'JavaScript source'}
      />
    );

    const tab = await screen.findByRole('tab', { name: 'JavaScript source' });

    expect(tab).toHaveAttribute('data-selected', 'true');
  });

  it('uses fallbackFileName for an unnamed visible tab', async () => {
    render(
      <CodeBlock
        files={jsFile}
        hideTabs={false}
        fallbackFileName="snippet.js"
      />
    );

    expect(
      await screen.findByRole('tab', { name: 'snippet.js' })
    ).toBeInTheDocument();
  });

  it('keeps a controlled activeFileIndex until the prop changes', async () => {
    const onActiveFileIndexChange = vi.fn();

    const { rerender } = render(
      <CodeBlock
        files={multiFile}
        activeFileIndex={0}
        onActiveFileIndexChange={onActiveFileIndexChange}
      />
    );

    await waitFor(() =>
      expect(getCode()).toHaveAttribute('data-language', 'xml')
    );

    await user.click(screen.getByRole('tab', { name: 'main.ts' }));

    expect(onActiveFileIndexChange).toHaveBeenCalledWith(1);
    expect(getCode()).toHaveAttribute('data-language', 'xml');

    rerender(
      <CodeBlock
        files={multiFile}
        activeFileIndex={1}
        onActiveFileIndexChange={onActiveFileIndexChange}
      />
    );

    await waitFor(() =>
      expect(getCode()).toHaveAttribute('data-language', 'javascript')
    );
  });

  it('applies visual, default state and DOM passthrough props', async () => {
    render(
      <CodeBlock
        files={[
          {
            content: 'const first = 1;\nconst second = 2;',
            language: 'javascript',
            filename: 'example.js',
          },
        ]}
        hasLineNumbers
        startFrom={10}
        isFilled
        hideBorder
        defaultSoftWrap
        defaultViewAll
        defaultHideTabs
        className="custom-class"
        style={{ inlineSize: 320 }}
        data-testid="root"
        data-context="example"
      />
    );

    await waitFor(() =>
      expect(getCode()).toHaveAttribute('data-language', 'javascript')
    );

    const root = screen.getByTestId('root');

    expect(root).toHaveClass('custom-class');
    expect(root).toHaveStyle({ inlineSize: '320px' });
    expect(root).toHaveAttribute('data-context', 'example');
    expect(root).toHaveAttribute('data-filled');
    expect(root).toHaveAttribute('data-border-hidden');
    expect(root).toHaveAttribute('data-line-numbers');
    expect(root).toHaveAttribute('data-hide-tabs');
    expect(root).toHaveAttribute('data-soft-wrap');
    expect(root).toHaveAttribute('data-view-all');

    expect(
      Array.from(document.querySelectorAll('.hljs-ln-numbers')).map((cell) =>
        cell.getAttribute('data-line-number')
      )
    ).toEqual(['10', '11']);
  });

  describe('highlight configuration', () => {
    it('loads and reuses only the languages provided by the nearest provider', async () => {
      const loadCore = vi.fn(() => import('highlight.js/lib/core'));

      const loadJavaScript = vi.fn(
        () => import('highlight.js/lib/languages/javascript')
      );

      const config: CodeBlockHighlightConfig = {
        core: loadCore,
        languages: { javascript: loadJavaScript },
      };

      render(
        <CodeBlockHighlightConfigProvider config={config}>
          <CodeBlock files={jsFile} />
          <CodeBlock files={jsFile} />
        </CodeBlockHighlightConfigProvider>
      );

      await waitFor(() =>
        expect(
          document.querySelectorAll('code[data-language="javascript"]')
        ).toHaveLength(2)
      );

      expect(loadCore).toHaveBeenCalledTimes(1);
      expect(loadJavaScript).toHaveBeenCalledTimes(1);

      expect(document.querySelector('.hljs-keyword')).toHaveTextContent(
        'const'
      );
    });

    it('escapes source text when neither the requested nor fallback language is registered', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const hljs = {
        getLanguage: vi.fn(() => undefined),
        highlight: vi.fn(),
        registerLanguage: vi.fn(),
      } as unknown as HLJSApi;

      const config: CodeBlockHighlightConfig = {
        core: vi.fn().mockResolvedValue({ default: hljs }),
        fallbackLanguage: 'text',
      };

      const content = '<script>"unsafe"</script>';
      const file = { content, language: 'unknown' };

      render(
        <CodeBlockHighlightConfigProvider config={config}>
          <CodeBlock files={[file]} />
        </CodeBlockHighlightConfigProvider>
      );

      await waitFor(() =>
        expect(getCode()).toHaveAttribute('data-language', 'text')
      );

      expect(getCode()).toHaveTextContent(content);
      expect(getCode()?.innerHTML).toContain('&lt;script&gt;');
      expect(getCode()?.querySelector('script')).toBeNull();
      expect(hljs.highlight).not.toHaveBeenCalled();

      expect(warnSpy).toHaveBeenCalledWith(
        '[koobiq] [CodeBlock] Unsupported file language: "unknown". Fall back to "text".',
        file
      );
    });

    it('reports a missing language without printing undefined', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const hljs = {
        getLanguage: vi.fn((language: string) =>
          language === 'plaintext' ? {} : undefined
        ),
        highlight: vi.fn(() => ({
          value: 'plain text',
          language: 'plaintext',
          illegal: false,
          relevance: 1,
        })),
        registerLanguage: vi.fn(),
      } as unknown as HLJSApi;

      const config: CodeBlockHighlightConfig = {
        core: vi.fn().mockResolvedValue({ default: hljs }),
      };

      const file = { content: 'plain text' };

      render(
        <CodeBlockHighlightConfigProvider config={config}>
          <CodeBlock files={[file]} />
        </CodeBlockHighlightConfigProvider>
      );

      await waitFor(() =>
        expect(getCode()).toHaveAttribute('data-language', 'plaintext')
      );

      expect(warnSpy).toHaveBeenCalledWith(
        '[koobiq] [CodeBlock] Missing file language. Fall back to "plaintext".',
        file
      );
    });

    it('keeps the raw source visible when highlighting fails', async () => {
      const error = new Error('load failed');
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const config: CodeBlockHighlightConfig = {
        core: vi.fn().mockRejectedValue(error),
      };

      render(
        <CodeBlockHighlightConfigProvider config={config}>
          <CodeBlock files={jsFile} />
        </CodeBlockHighlightConfigProvider>
      );

      await waitFor(() =>
        expect(warnSpy).toHaveBeenCalledWith(
          '[koobiq] [CodeBlock] Failed to highlight the file.',
          error
        )
      );

      const code = document.querySelector('code.hljs');

      expect(code).not.toHaveAttribute('data-language');
      expect(code).toHaveTextContent('const answer = 42;');
    });
  });

  describe('action bar', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('copies the active file content', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);

      vi.stubGlobal('navigator', {
        ...navigator,
        clipboard: { writeText },
      } as unknown as Navigator);

      render(<CodeBlock files={jsFile} />);

      await waitFor(() => expect(getCode()).not.toBeNull());

      await user.click(screen.getByRole('button', { name: 'Copy' }));

      expect(writeText).toHaveBeenCalledWith('const answer = 42;');

      vi.unstubAllGlobals();
    });

    it('shows copied feedback until the copy tooltip closes', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);

      vi.stubGlobal('navigator', {
        ...navigator,
        clipboard: { writeText },
      } as unknown as Navigator);

      render(<CodeBlock files={jsFile} />);

      const copyButton = await screen.findByRole('button', { name: 'Copy' });

      await user.hover(copyButton);
      expect(await screen.findByText('Copy')).toBeVisible();

      await user.click(copyButton);
      expect(await screen.findByText('✓ Copied')).toBeVisible();

      await user.unhover(copyButton);

      await waitFor(() =>
        expect(screen.queryByText('✓ Copied')).not.toBeInTheDocument()
      );

      await user.hover(copyButton);
      expect(await screen.findByText('Copy')).toBeVisible();

      vi.unstubAllGlobals();
    });

    it('closes an open tooltip when pointer enters its portal', async () => {
      render(<CodeBlock files={jsFile} data-testid="root" />);

      const copyButton = await screen.findByRole('button', { name: 'Copy' });

      await user.hover(copyButton);

      await waitFor(() =>
        expect(screen.getByRole('tooltip')).toHaveAttribute(
          'data-transition',
          'entered'
        )
      );

      await user.hover(screen.getByRole('tooltip'));

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('toggles an uncontrolled defaultSoftWrap value and reports the change', async () => {
      const onSoftWrapChange = vi.fn();

      render(
        <CodeBlock
          files={jsFile}
          canToggleSoftWrap
          defaultSoftWrap
          onSoftWrapChange={onSoftWrapChange}
          data-testid="root"
        />
      );

      await waitFor(() => expect(getCode()).not.toBeNull());

      const root = screen.getByTestId('root');
      expect(root).toHaveAttribute('data-soft-wrap');

      await user.click(
        screen.getByRole('button', { name: 'Disable word wrap' })
      );

      expect(onSoftWrapChange).toHaveBeenCalledWith(false);
      expect(root).not.toHaveAttribute('data-soft-wrap');

      expect(
        screen.getByRole('button', { name: 'Enable word wrap' })
      ).toBeInTheDocument();
    });

    it('reports a controlled softWrap change without mutating the rendered state', async () => {
      const onSoftWrapChange = vi.fn();

      render(
        <CodeBlock
          files={jsFile}
          canToggleSoftWrap
          softWrap
          onSoftWrapChange={onSoftWrapChange}
          data-testid="root"
        />
      );

      await user.click(
        await screen.findByRole('button', { name: 'Disable word wrap' })
      );

      expect(onSoftWrapChange).toHaveBeenCalledWith(false);
      expect(screen.getByTestId('root')).toHaveAttribute('data-soft-wrap');
    });

    it('hides the copy button when requested', async () => {
      render(<CodeBlock files={jsFile} hideCopyButton />);

      await waitFor(() => expect(getCode()).not.toBeNull());

      expect(
        screen.queryByRole('button', { name: 'Copy' })
      ).not.toBeInTheDocument();
    });

    it('downloads the active file as a blob', async () => {
      const createObjectURL = vi.fn().mockReturnValue('blob:mock-url');
      const revokeObjectURL = vi.fn();

      vi.stubGlobal('URL', {
        ...URL,
        createObjectURL,
        revokeObjectURL,
      });

      const clickedLinks: HTMLAnchorElement[] = [];

      const clickSpy = vi
        .spyOn(HTMLAnchorElement.prototype, 'click')
        .mockImplementation(function (this: HTMLAnchorElement) {
          clickedLinks.push(this);
          expect(this.isConnected).toBe(true);
        });

      const { rerender } = render(
        <CodeBlock files={jsFile} canDownload fallbackFileName="snippet.js" />
      );

      await waitFor(() => expect(getCode()).not.toBeNull());

      await user.click(screen.getByRole('button', { name: 'Download' }));

      expect(createObjectURL).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();

      expect(clickSpy.mock.instances[0]).toMatchObject({
        download: 'snippet.js',
        href: 'blob:mock-url',
      });

      expect(clickedLinks[0]?.isConnected).toBe(false);

      await waitFor(() =>
        expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
      );

      rerender(
        <CodeBlock
          files={[{ ...jsFile[0]!, filename: 'main.js' }]}
          canDownload
          fallbackFileName="snippet.js"
        />
      );

      await user.click(screen.getByRole('button', { name: 'Download' }));

      expect(clickSpy.mock.instances[1]).toMatchObject({
        download: 'main.js',
      });

      await waitFor(() => expect(revokeObjectURL).toHaveBeenCalledTimes(2));
    });

    it('opens the file link in a new tab', async () => {
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

      render(
        <CodeBlock files={[{ ...jsFile[0]!, link: 'https://example.com' }]} />
      );

      await waitFor(() => expect(getCode()).not.toBeNull());

      await user.click(
        screen.getByRole('button', { name: 'Open in the external system' })
      );

      expect(openSpy).toHaveBeenCalledWith(
        'https://example.com',
        '_blank',
        'noopener,noreferrer'
      );

      openSpy.mockRestore();
    });
  });

  it('limits overflowing content and toggles viewAll', async () => {
    let resize: ResizeObserverCallback;

    class ResizeObserverMock {
      callback: ResizeObserverCallback;

      constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
      }

      observe = vi.fn((target: Element) => {
        if (target.tagName === 'PRE') resize = this.callback;
      });
      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    vi.stubGlobal('ResizeObserver', ResizeObserverMock);

    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      callback(0);

      return 1;
    });

    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    const onViewAllChange = vi.fn();

    const scrollToSpy = vi
      .spyOn(HTMLElement.prototype, 'scrollTo')
      .mockImplementation(() => {});

    render(
      <CodeBlock
        files={jsFile}
        maxHeight={100}
        onViewAllChange={onViewAllChange}
        data-testid="root"
      />
    );

    await waitFor(() => expect(getCode()).not.toBeNull());

    act(() => resize!([createResizeEntry(180)], {} as ResizeObserver));

    const main = screen.getByRole('region', { name: 'code' });

    expect(main).toHaveStyle({ maxHeight: '100px' });

    await user.click(screen.getByRole('button', { name: 'Show all' }));

    expect(onViewAllChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByTestId('root')).toHaveAttribute('data-view-all');
    expect(main.style.maxHeight).toBe('');

    await user.click(screen.getByRole('button', { name: 'Show less' }));

    expect(onViewAllChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByTestId('root')).not.toHaveAttribute('data-view-all');
    expect(main).toHaveStyle({ maxHeight: '100px' });

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 0,
      behavior: 'instant',
    });
  });

  it('reflects controlled viewAll prop updates', async () => {
    const { rerender } = render(
      <CodeBlock files={jsFile} viewAll data-testid="root" />
    );

    await waitFor(() => expect(getCode()).not.toBeNull());

    expect(screen.getByTestId('root')).toHaveAttribute('data-view-all');

    rerender(<CodeBlock files={jsFile} viewAll={false} data-testid="root" />);

    expect(screen.getByTestId('root')).not.toHaveAttribute('data-view-all');
  });

  it('forwards an imperative handle exposing the root element and scrollTo', async () => {
    const ref = createRef<CodeBlockRef>();

    const scrollToSpy = vi
      .spyOn(HTMLElement.prototype, 'scrollTo')
      .mockImplementation(() => {});

    render(<CodeBlock files={jsFile} ref={ref} data-testid="root" />);

    await waitFor(() => expect(getCode()).not.toBeNull());

    expect(ref.current?.element).toBe(screen.getByTestId('root'));

    ref.current?.scrollTo({ top: 0 });
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0 });

    scrollToSpy.mockRestore();
  });

  it('queues imperative scrolling until highlighting finishes', async () => {
    let resolveCore!: (module: { default: HLJSApi }) => void;

    const corePromise = new Promise<{ default: HLJSApi }>((resolve) => {
      resolveCore = resolve;
    });

    const hljs = {
      getLanguage: vi.fn(() => ({})),
      registerLanguage: vi.fn(),
      highlight: vi.fn(() => ({
        value: '<span class="hljs-keyword">const</span> answer = 42;',
        language: 'javascript',
        relevance: 1,
        illegal: false,
      })),
    } as unknown as HLJSApi;

    const config: CodeBlockHighlightConfig = {
      core: vi.fn(() => corePromise),
    };

    const ref = createRef<CodeBlockRef>();

    const scrollToSpy = vi
      .spyOn(HTMLElement.prototype, 'scrollTo')
      .mockImplementation(() => {});

    render(
      <CodeBlockHighlightConfigProvider config={config}>
        <CodeBlock files={jsFile} ref={ref} />
      </CodeBlockHighlightConfigProvider>
    );

    ref.current?.scrollTo({ top: 24, behavior: 'instant' });
    expect(scrollToSpy).not.toHaveBeenCalled();

    resolveCore({ default: hljs });

    await waitFor(() =>
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 24,
        left: undefined,
        behavior: 'instant',
      })
    );
  });

  it('supports scrolling from the bottom edge', async () => {
    const ref = createRef<CodeBlockRef>();

    const scrollToSpy = vi
      .spyOn(HTMLElement.prototype, 'scrollTo')
      .mockImplementation(() => {});

    render(<CodeBlock files={jsFile} ref={ref} />);

    await waitFor(() =>
      expect(getCode()).toHaveAttribute('data-language', 'javascript')
    );

    const panel = screen.getByRole('region', { name: 'code' });

    Object.defineProperties(panel, {
      scrollHeight: { configurable: true, value: 600 },
      clientHeight: { configurable: true, value: 200 },
    });

    ref.current?.scrollTo({ bottom: 16, behavior: 'instant' });

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 384,
      left: undefined,
      behavior: 'instant',
    });

    scrollToSpy.mockRestore();
  });

  it('resolves horizontal edge offsets for LTR and RTL content', async () => {
    const ref = createRef<CodeBlockRef>();

    const scrollToSpy = vi
      .spyOn(HTMLElement.prototype, 'scrollTo')
      .mockImplementation(() => {});

    render(<CodeBlock files={jsFile} ref={ref} />);

    await waitFor(() => expect(getCode()).not.toBeNull());

    const panel = screen.getByRole('region', { name: 'code' });

    Object.defineProperties(panel, {
      scrollWidth: { configurable: true, value: 600 },
      clientWidth: { configurable: true, value: 200 },
    });

    ref.current?.scrollTo({ left: 32 });

    expect(scrollToSpy).toHaveBeenLastCalledWith({
      top: undefined,
      left: 32,
      behavior: undefined,
    });

    ref.current?.scrollTo({ right: 20 });

    expect(scrollToSpy).toHaveBeenLastCalledWith({
      top: undefined,
      left: 380,
      behavior: undefined,
    });

    ref.current?.scrollTo({ end: 16 });

    expect(scrollToSpy).toHaveBeenLastCalledWith({
      top: undefined,
      left: 384,
      behavior: undefined,
    });

    panel.style.direction = 'rtl';
    ref.current?.scrollTo({ start: 12 });

    expect(scrollToSpy).toHaveBeenLastCalledWith({
      top: undefined,
      left: -12,
      behavior: undefined,
    });

    ref.current?.scrollTo({ end: 16 });

    expect(scrollToSpy).toHaveBeenLastCalledWith({
      top: undefined,
      left: -384,
      behavior: undefined,
    });
  });

  it('tracks vertical scrolling to display the header shadow', async () => {
    render(<CodeBlock files={jsFile} />);

    await waitFor(() => expect(getCode()).not.toBeNull());

    const panel = screen.getByRole('region', { name: 'code' });
    const header = screen.getByTestId('code-block-header');

    expect(header).not.toHaveAttribute('data-scrolled');

    Object.defineProperty(panel, 'scrollTop', {
      configurable: true,
      value: 10,
      writable: true,
    });

    fireEvent.scroll(panel);
    expect(header).toHaveAttribute('data-scrolled');

    panel.scrollTop = 0;
    fireEvent.scroll(panel);
    expect(header).not.toHaveAttribute('data-scrolled');
  });

  it('clamps an out-of-range active file index', async () => {
    const onActiveFileIndexChange = vi.fn();

    render(
      <CodeBlock
        files={multiFile}
        defaultActiveFileIndex={10}
        onActiveFileIndexChange={onActiveFileIndexChange}
      />
    );

    await waitFor(() =>
      expect(getCode()).toHaveAttribute('data-language', 'javascript')
    );

    expect(onActiveFileIndexChange).toHaveBeenCalledWith(1);
  });

  it('does not emit a derived change for a controlled out-of-range active file index', async () => {
    const firstOnChange = vi.fn();
    const secondOnChange = vi.fn();

    const { rerender } = render(
      <CodeBlock
        files={multiFile}
        activeFileIndex={10}
        onActiveFileIndexChange={firstOnChange}
      />
    );

    await waitFor(() =>
      expect(getCode()).toHaveAttribute('data-language', 'javascript')
    );

    expect(firstOnChange).not.toHaveBeenCalled();

    rerender(
      <CodeBlock
        files={multiFile}
        activeFileIndex={10}
        onActiveFileIndexChange={secondOnChange}
      />
    );

    expect(secondOnChange).not.toHaveBeenCalled();
  });

  it('keeps the action bar visible when tabs are hidden if requested', async () => {
    render(<CodeBlock files={jsFile} alwaysShowActionBar data-testid="root" />);

    await waitFor(() => expect(getCode()).not.toBeNull());

    expect(screen.getByTestId('root')).toHaveAttribute(
      'data-always-show-action-bar'
    );
  });

  it('warns when files is empty', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const { unmount } = render(<CodeBlock files={[]} />);

    expect(warnSpy).toHaveBeenCalledWith(
      '[koobiq] CodeBlock: "files" should contain at least one file.'
    );

    unmount();
  });
});
