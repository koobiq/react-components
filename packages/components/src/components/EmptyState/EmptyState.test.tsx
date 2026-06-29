import { createRef } from 'react';

import { screen, render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { EmptyState } from './index';

describe('EmptyState', () => {
  const baseProps = { 'data-testid': 'empty-state' };

  it('should accept the ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(<EmptyState {...baseProps} ref={ref} />);

    expect(ref.current).toBe(screen.getByTestId('empty-state'));
  });

  it('should merge a custom class name with the default ones', () => {
    render(<EmptyState {...baseProps} className="foo" />);

    expect(screen.getByTestId('empty-state')).toHaveClass('foo');
  });

  it('should render the subcomponents', () => {
    render(
      <EmptyState {...baseProps}>
        <EmptyState.Media data-testid="media" />
        <EmptyState.Title data-testid="title">Title</EmptyState.Title>
        <EmptyState.Content data-testid="content">Content</EmptyState.Content>
        <EmptyState.Actions data-testid="actions">Actions</EmptyState.Actions>
      </EmptyState>
    );

    expect(screen.getByTestId('media')).toBeInTheDocument();
    expect(screen.getByTestId('title')).toHaveTextContent('Title');
    expect(screen.getByTestId('content')).toHaveTextContent('Content');
    expect(screen.getByTestId('actions')).toHaveTextContent('Actions');
  });

  it('should default to the "normal" size, centered and non-error', () => {
    render(<EmptyState {...baseProps} />);

    const root = screen.getByTestId('empty-state');

    expect(root).toHaveAttribute('data-size', 'normal');
    expect(root).toHaveAttribute('data-align', 'center');
    expect(root).not.toHaveAttribute('data-invalid');
  });

  it('should reflect the align prop', () => {
    render(<EmptyState {...baseProps} align="start" />);

    expect(screen.getByTestId('empty-state')).toHaveAttribute(
      'data-align',
      'start'
    );
  });

  it('should support the polymorphic "as" prop on the root', () => {
    render(<EmptyState {...baseProps} as="section" />);

    expect(screen.getByTestId('empty-state').tagName).toBe('SECTION');
  });

  it('should propagate size and invalid state to the subcomponents via context', () => {
    render(
      <EmptyState {...baseProps} size="big" isInvalid>
        <EmptyState.Title data-testid="title">Title</EmptyState.Title>
      </EmptyState>
    );

    const title = screen.getByTestId('title');

    expect(title).toHaveAttribute('data-size', 'big');
    expect(title).toHaveAttribute('data-invalid');
  });

  it('should render Title as "h3" and Content as "p" by default', () => {
    render(
      <EmptyState {...baseProps}>
        <EmptyState.Title data-testid="title">Title</EmptyState.Title>
        <EmptyState.Content data-testid="content">Content</EmptyState.Content>
      </EmptyState>
    );

    expect(screen.getByTestId('title').tagName).toBe('H3');
    expect(screen.getByTestId('content').tagName).toBe('P');
  });

  it('should support the polymorphic "as" prop on Title and Content', () => {
    render(
      <EmptyState {...baseProps}>
        <EmptyState.Title as="h1" data-testid="title">
          Title
        </EmptyState.Title>
        <EmptyState.Content as="span" data-testid="content">
          Content
        </EmptyState.Content>
      </EmptyState>
    );

    expect(screen.getByTestId('title').tagName).toBe('H1');
    expect(screen.getByTestId('content').tagName).toBe('SPAN');
  });
});

describe('EmptyState subcomponents', () => {
  it('should forward refs to the underlying elements', () => {
    const mediaRef = createRef<HTMLDivElement>();
    const titleRef = createRef<HTMLHeadingElement>();
    const contentRef = createRef<HTMLParagraphElement>();
    const actionsRef = createRef<HTMLDivElement>();

    render(
      <EmptyState>
        <EmptyState.Media ref={mediaRef} data-testid="media" />
        <EmptyState.Title ref={titleRef} data-testid="title">
          Title
        </EmptyState.Title>
        <EmptyState.Content ref={contentRef} data-testid="content">
          Content
        </EmptyState.Content>
        <EmptyState.Actions ref={actionsRef} data-testid="actions" />
      </EmptyState>
    );

    expect(mediaRef.current).toBe(screen.getByTestId('media'));
    expect(titleRef.current).toBe(screen.getByTestId('title'));
    expect(contentRef.current).toBe(screen.getByTestId('content'));
    expect(actionsRef.current).toBe(screen.getByTestId('actions'));
  });

  it('should merge a custom class name on each subcomponent', () => {
    render(
      <EmptyState>
        <EmptyState.Media className="m" data-testid="media" />
        <EmptyState.Title className="t" data-testid="title">
          Title
        </EmptyState.Title>
        <EmptyState.Content className="c" data-testid="content">
          Content
        </EmptyState.Content>
        <EmptyState.Actions className="a" data-testid="actions" />
      </EmptyState>
    );

    expect(screen.getByTestId('media')).toHaveClass('m');
    expect(screen.getByTestId('title')).toHaveClass('t');
    expect(screen.getByTestId('content')).toHaveClass('c');
    expect(screen.getByTestId('actions')).toHaveClass('a');
  });

  it('should propagate the size to every subcomponent', () => {
    render(
      <EmptyState size="compact">
        <EmptyState.Media data-testid="media" />
        <EmptyState.Title data-testid="title">Title</EmptyState.Title>
        <EmptyState.Content data-testid="content">Content</EmptyState.Content>
        <EmptyState.Actions data-testid="actions" />
      </EmptyState>
    );

    for (const id of ['media', 'title', 'content', 'actions']) {
      expect(screen.getByTestId(id)).toHaveAttribute('data-size', 'compact');
    }
  });

  it('should propagate the align value to the media', () => {
    render(
      <EmptyState align="start">
        <EmptyState.Media data-testid="media" />
      </EmptyState>
    );

    expect(screen.getByTestId('media')).toHaveAttribute('data-align', 'start');
  });

  it('should mark media, title and content as invalid', () => {
    render(
      <EmptyState isInvalid>
        <EmptyState.Media data-testid="media" />
        <EmptyState.Title data-testid="title">Title</EmptyState.Title>
        <EmptyState.Content data-testid="content">Content</EmptyState.Content>
      </EmptyState>
    );

    expect(screen.getByTestId('media')).toHaveAttribute('data-invalid');
    expect(screen.getByTestId('title')).toHaveAttribute('data-invalid');
    expect(screen.getByTestId('content')).toHaveAttribute('data-invalid');
  });
});
