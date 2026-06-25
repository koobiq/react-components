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

  it('should default to the "normal" size and "default" state', () => {
    render(<EmptyState {...baseProps} />);

    const root = screen.getByTestId('empty-state');

    expect(root).toHaveAttribute('data-size', 'normal');
    expect(root).toHaveAttribute('data-state', 'default');
  });

  it('should propagate size and state to the subcomponents via context', () => {
    render(
      <EmptyState {...baseProps} size="big" state="error">
        <EmptyState.Title data-testid="title">Title</EmptyState.Title>
      </EmptyState>
    );

    const title = screen.getByTestId('title');

    expect(title).toHaveAttribute('data-size', 'big');
    expect(title).toHaveAttribute('data-state', 'error');
  });
});
