import { render, screen } from '@testing-library/react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { Tree } from './index';

describe('Tree', () => {
  const originalIntersectionObserver = globalThis.IntersectionObserver;

  beforeAll(() => {
    // jsdom doesn't provide IntersectionObserver, but Tree.LoadMoreItem uses it.
    globalThis.IntersectionObserver = vi.fn(() => ({
      disconnect: () => {},
      observe: () => {},
      takeRecords: () => [],
      unobserve: () => {},
    })) as unknown as typeof IntersectionObserver;
  });

  afterAll(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver;
  });

  it('should merge custom className with default root class', () => {
    render(
      <Tree
        aria-label="Files"
        data-testid="tree"
        className={() => 'tree-custom'}
      >
        <Tree.Item id="documents" textValue="Documents">
          <Tree.ItemContent>Documents</Tree.ItemContent>
        </Tree.Item>
      </Tree>
    );

    expect(screen.getByTestId('tree')).toHaveClass('kbq-Tree', 'tree-custom');
  });

  it('should merge custom className with default Tree.Item class', () => {
    render(
      <Tree aria-label="Files">
        <Tree.Item
          id="documents"
          textValue="Documents"
          data-testid="tree-item"
          className={() => 'tree-item-custom'}
        >
          <Tree.ItemContent>Documents</Tree.ItemContent>
        </Tree.Item>
      </Tree>
    );

    expect(screen.getByTestId('tree-item')).toHaveClass(
      'kbq-TreeItem',
      'tree-item-custom'
    );
  });

  it('should pass slotProps to chevron and checkbox controls in Tree.ItemContent', () => {
    render(
      <Tree
        aria-label="Files"
        selectionMode="multiple"
        selectionBehavior="toggle"
        defaultExpandedKeys={['documents']}
      >
        <Tree.Item id="documents" textValue="Documents">
          <Tree.ItemContent
            slotProps={{
              chevron: {
                'data-testid': 'tree-chevron',
                className: 'tree-chevron-custom',
              },
              checkbox: {
                'data-testid': 'tree-selection',
                className: 'tree-selection-custom',
              },
            }}
          >
            Documents
          </Tree.ItemContent>
          <Tree.Item id="project" textValue="Project">
            <Tree.ItemContent>Project</Tree.ItemContent>
          </Tree.Item>
        </Tree.Item>
      </Tree>
    );

    expect(screen.getByTestId('tree-chevron')).toHaveClass(
      'tree-chevron-custom'
    );

    expect(screen.getByTestId('tree-selection')).toHaveClass(
      'tree-selection-custom'
    );
  });

  it('should mark disabled item via disabledKeys', () => {
    render(
      <Tree
        aria-label="Files"
        selectionMode="single"
        defaultExpandedKeys={['documents']}
        disabledKeys={['project']}
      >
        <Tree.Item id="documents" textValue="Documents">
          <Tree.ItemContent>Documents</Tree.ItemContent>
          <Tree.Item
            id="project"
            textValue="Project"
            data-testid="project-item"
          >
            <Tree.ItemContent>Project</Tree.ItemContent>
          </Tree.Item>
        </Tree.Item>
      </Tree>
    );

    expect(screen.getByTestId('project-item')).toHaveAttribute(
      'data-disabled',
      'true'
    );
  });

  it('should merge className and style in Tree.LoadMoreItem', () => {
    const onLoadMore = vi.fn();

    render(
      <Tree aria-label="Files" defaultExpandedKeys={['documents']}>
        <Tree.Item id="documents" textValue="Documents">
          <Tree.ItemContent>Documents</Tree.ItemContent>
          <Tree.LoadMoreItem
            data-testid="load-more"
            onLoadMore={onLoadMore}
            isLoading
            className={() => 'load-more-custom'}
            style={() => ({ padding: 8 })}
          />
        </Tree.Item>
      </Tree>
    );

    expect(screen.getByTestId('load-more')).toHaveClass(
      'kbq-TreeLoadMoreItem',
      'load-more-custom'
    );

    expect(screen.getByTestId('load-more')).toHaveStyle({ padding: '8px' });
  });
});
