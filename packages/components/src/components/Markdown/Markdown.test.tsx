import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { Markdown } from './index.js';

describe('Markdown', () => {
  it('should accept the ref', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(<Markdown ref={ref}># Heading</Markdown>);
    expect(ref.current).toBe(container.firstElementChild);
  });

  it('should accept a custom class', () => {
    const { container } = render(
      <Markdown className="foo"># Heading</Markdown>
    );

    expect(container.firstElementChild).toHaveClass('foo');
  });

  it('should render headers', () => {
    render(<Markdown>{'# Heading 1\n\n## Heading 2'}</Markdown>);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Heading 1' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { level: 2, name: 'Heading 2' })
    ).toBeInTheDocument();
  });

  it('should render a paragraph', () => {
    render(<Markdown>Some paragraph text.</Markdown>);
    expect(screen.getByText('Some paragraph text.')).toBeInTheDocument();
  });

  it('should render a list', () => {
    render(<Markdown>{'- First item\n- Second item'}</Markdown>);

    expect(screen.getByText('First item')).toBeInTheDocument();
    expect(screen.getByText('Second item')).toBeInTheDocument();
  });

  it('should render a table', () => {
    render(<Markdown>{'| A | B |\n| - | - |\n| 1 | 2 |'}</Markdown>);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('should render a link with href', () => {
    render(<Markdown>{'[koobiq](https://www.koobiq.io)'}</Markdown>);

    const link = screen.getByRole('link', { name: 'koobiq' });
    expect(link).toHaveAttribute('href', 'https://www.koobiq.io');
  });

  it('should apply markedOptions to the parser', () => {
    const { container } = render(
      <Markdown markedOptions={{ breaks: true }}>
        {'First line\nSecond line'}
      </Markdown>
    );

    expect(container.querySelector('br')).toBeInTheDocument();
  });

  it('should re-render when children change', () => {
    const { rerender } = render(<Markdown># First</Markdown>);
    expect(screen.getByRole('heading', { name: 'First' })).toBeInTheDocument();

    rerender(<Markdown># Second</Markdown>);
    expect(screen.getByRole('heading', { name: 'Second' })).toBeInTheDocument();

    expect(
      screen.queryByRole('heading', { name: 'First' })
    ).not.toBeInTheDocument();
  });

  it('should sanitize a raw script tag', () => {
    const { container } = render(
      <Markdown>{'<script>window.xssTriggered = true;</script>'}</Markdown>
    );

    expect(container.querySelector('script')).not.toBeInTheDocument();
  });

  it('should strip event handler attributes from raw HTML', () => {
    const { container } = render(
      <Markdown>
        {'<img src="x" onerror="window.xssTriggered = true" />'}
      </Markdown>
    );

    const img = container.querySelector('img');
    expect(img).not.toHaveAttribute('onerror');
  });

  it('should not crash and should ignore a dangerouslySetInnerHTML prop', () => {
    expect(() =>
      render(
        // eslint-disable-next-line react/no-danger-with-children -- verifying the runtime guard strips this prop for untyped callers
        <Markdown
          // @ts-expect-error MarkdownProps excludes dangerouslySetInnerHTML; verifying the runtime guard for untyped callers.
          dangerouslySetInnerHTML={{
            __html: '<script>window.xssTriggered = true;</script>',
          }}
        >
          # Heading
        </Markdown>
      )
    ).not.toThrow();

    expect(
      screen.getByRole('heading', { name: 'Heading' })
    ).toBeInTheDocument();
  });

  it('should keep the language class on a fenced code block alongside the injected class', () => {
    const { container } = render(
      <Markdown>{'```js\nconst a = 1;\n```'}</Markdown>
    );

    const code = container.querySelector('pre > code');
    expect(code).toHaveClass('language-js');
    expect(code?.className.split(' ').length).toBeGreaterThan(1);
  });
});
