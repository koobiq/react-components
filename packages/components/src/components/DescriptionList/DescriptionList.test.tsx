import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { BreakpointsContext, type BreakpointsContextType } from '../Provider';

import { DescriptionList } from './index';

const baseProps = { 'data-testid': 'description-list' };

const getRoot = () => screen.getByTestId('description-list');

const getTerms = () =>
  screen.queryAllByRole('term').map((term) => term.textContent);

const getColumns = () =>
  getRoot().style.getPropertyValue('--description-list-columns');

describe('DescriptionList', () => {
  it('should forward the ref to the dl element', () => {
    const ref = createRef<HTMLDListElement>();

    render(<DescriptionList {...baseProps} ref={ref} />);

    expect(ref.current).toBe(getRoot());
    expect(getRoot().tagName).toBe('DL');
  });

  it('should merge a custom class name and style', () => {
    render(
      <DescriptionList
        {...baseProps}
        className="foo"
        style={{ marginBlockStart: 4 }}
      />
    );

    expect(getRoot()).toHaveClass('foo');
    expect(getRoot()).toHaveStyle({ marginBlockStart: '4px' });
  });

  it('should use the default props', () => {
    render(<DescriptionList {...baseProps} />);

    expect(getRoot()).toHaveAttribute('data-orientation', 'horizontal');
    expect(getRoot()).toHaveAttribute('data-align-items', 'stretch');
    expect(getRoot()).toHaveAttribute('data-justify-items', 'stretch');
    expect(getRoot()).toHaveStyle('--description-list-align-items: stretch');
    expect(getRoot()).toHaveStyle('--description-list-justify-items: stretch');
    expect(getColumns()).toBe('');
  });

  it('should apply the orientation', () => {
    render(<DescriptionList {...baseProps} orientation="vertical" />);

    expect(getRoot()).toHaveAttribute('data-orientation', 'vertical');
  });

  it('should resolve the orientation for the matched breakpoints', () => {
    const renderList = (breakpoints: Partial<BreakpointsContextType>) => (
      <BreakpointsContext.Provider
        value={breakpoints as BreakpointsContextType}
      >
        <DescriptionList
          {...baseProps}
          orientation={{ xs: 'vertical', m: 'horizontal' }}
        />
      </BreakpointsContext.Provider>
    );

    const { rerender } = render(renderList({ xs: true, s: true }));

    expect(getRoot()).toHaveAttribute('data-orientation', 'vertical');

    rerender(renderList({ xs: true, s: true, m: true }));

    expect(getRoot()).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('should fall back to the horizontal orientation when no breakpoint matches', () => {
    render(
      <BreakpointsContext.Provider
        value={{ xs: true } as BreakpointsContextType}
      >
        <DescriptionList {...baseProps} orientation={{ m: 'vertical' }} />
      </BreakpointsContext.Provider>
    );

    expect(getRoot()).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('should set the columns', () => {
    const { rerender } = render(
      <DescriptionList {...baseProps} columns="repeat(2, 1fr)" />
    );

    expect(getColumns()).toBe('repeat(2, 1fr)');

    rerender(<DescriptionList {...baseProps} columns="200px 1fr" />);

    expect(getColumns()).toBe('200px 1fr');
  });

  it('should resolve the columns for the matched breakpoints', () => {
    const renderList = (breakpoints: Partial<BreakpointsContextType>) => (
      <BreakpointsContext.Provider
        value={breakpoints as BreakpointsContextType}
      >
        <DescriptionList
          {...baseProps}
          columns={{ xs: '200px 1fr', m: 'repeat(2, 1fr)' }}
        />
      </BreakpointsContext.Provider>
    );

    const { rerender } = render(renderList({ xs: true, s: true }));

    expect(getColumns()).toBe('200px 1fr');

    rerender(renderList({ xs: true, s: true, m: true }));

    expect(getColumns()).toBe('repeat(2, 1fr)');
  });

  it('should keep the custom style with the columns', () => {
    render(
      <DescriptionList
        {...baseProps}
        columns="auto 1fr"
        style={{ marginBlockStart: 4 }}
      />
    );

    expect(getRoot()).toHaveStyle({ marginBlockStart: '4px' });
    expect(getColumns()).toBe('auto 1fr');
  });

  it('should apply the alignment props', () => {
    render(
      <DescriptionList {...baseProps} alignItems="center" justifyItems="end" />
    );

    expect(getRoot()).toHaveAttribute('data-align-items', 'center');
    expect(getRoot()).toHaveAttribute('data-justify-items', 'end');
    expect(getRoot()).toHaveStyle('--description-list-align-items: center');
    expect(getRoot()).toHaveStyle('--description-list-justify-items: end');
  });

  it('should resolve the alignment for the matched breakpoints', () => {
    render(
      <BreakpointsContext.Provider
        value={{ xs: true, s: true, m: true } as BreakpointsContextType}
      >
        <DescriptionList
          {...baseProps}
          alignItems={{ xs: 'start', m: 'center' }}
          justifyItems={{ xl: 'end' }}
        />
      </BreakpointsContext.Provider>
    );

    expect(getRoot()).toHaveAttribute('data-align-items', 'center');
    expect(getRoot()).toHaveStyle('--description-list-align-items: center');
    expect(getRoot()).toHaveAttribute('data-justify-items', 'stretch');
    expect(getRoot()).toHaveStyle('--description-list-justify-items: stretch');
  });

  it('should render the parts as semantic elements', () => {
    render(
      <DescriptionList {...baseProps}>
        <DescriptionList.Group id="status" data-testid="group">
          <DescriptionList.Term data-testid="term">Status</DescriptionList.Term>
          <DescriptionList.Description data-testid="description">
            New
          </DescriptionList.Description>
        </DescriptionList.Group>
      </DescriptionList>
    );

    expect(screen.getByTestId('group').tagName).toBe('DIV');
    expect(screen.getByTestId('term').tagName).toBe('DT');
    expect(screen.getByTestId('description').tagName).toBe('DD');

    expect(screen.getByTestId('group')).toHaveAttribute('data-slot', 'group');
    expect(screen.getByTestId('term')).toHaveAttribute('data-slot', 'term');

    expect(screen.getByTestId('description')).toHaveAttribute(
      'data-slot',
      'description'
    );

    expect(screen.getByRole('term')).toHaveTextContent('Status');
    expect(screen.getByRole('definition')).toHaveTextContent('New');
  });

  it('should forward the refs and class names of the parts', () => {
    const groupRef = createRef<HTMLDivElement>();
    const termRef = createRef<HTMLElement>();
    const descriptionRef = createRef<HTMLElement>();

    render(
      <DescriptionList>
        <DescriptionList.Group id="status" ref={groupRef} className="group">
          <DescriptionList.Term ref={termRef} className="term">
            Status
          </DescriptionList.Term>
          <DescriptionList.Description
            ref={descriptionRef}
            className="description"
          >
            New
          </DescriptionList.Description>
        </DescriptionList.Group>
      </DescriptionList>
    );

    expect(groupRef.current).toHaveClass('group');
    expect(termRef.current).toHaveClass('term');
    expect(descriptionRef.current).toHaveClass('description');
  });

  describe('static collection', () => {
    it('should render the groups in order', () => {
      render(
        <DescriptionList>
          <DescriptionList.Group id="type">
            <DescriptionList.Term>Incident type</DescriptionList.Term>
          </DescriptionList.Group>
          <DescriptionList.Group id="status">
            <DescriptionList.Term>Status</DescriptionList.Term>
          </DescriptionList.Group>
        </DescriptionList>
      );

      expect(getTerms()).toEqual(['Incident type', 'Status']);
    });

    it('should not pass the group id to the DOM', () => {
      render(
        <DescriptionList>
          <DescriptionList.Group id="status" data-testid="group">
            <DescriptionList.Term>Status</DescriptionList.Term>
          </DescriptionList.Group>
        </DescriptionList>
      );

      expect(screen.getByTestId('group')).not.toHaveAttribute('id');
    });

    it('should not render the parts outside a group and warn about them', () => {
      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      render(
        <DescriptionList>
          <DescriptionList.Group id="status">
            <DescriptionList.Term>Status</DescriptionList.Term>
          </DescriptionList.Group>
          <DescriptionList.Term>Orphan</DescriptionList.Term>
          <DescriptionList.Description>Orphan</DescriptionList.Description>
        </DescriptionList>
      );

      expect(getTerms()).toEqual(['Status']);
      expect(screen.queryAllByRole('definition')).toHaveLength(0);

      expect(consoleWarn).toHaveBeenCalledWith(
        '[koobiq] DescriptionList: "DescriptionList.Term" must be inside "DescriptionList.Group".'
      );

      expect(consoleWarn).toHaveBeenCalledWith(
        '[koobiq] DescriptionList: "DescriptionList.Description" must be inside "DescriptionList.Group".'
      );

      consoleWarn.mockRestore();
    });
  });

  describe('dynamic collection', () => {
    it('should take the keys from the id of the items', () => {
      const items = [
        { id: 'status', term: 'Status' },
        { id: 'assignee', term: 'Assignee' },
      ];

      render(
        <DescriptionList items={items}>
          {(item) => (
            <DescriptionList.Group data-testid={item.id}>
              <DescriptionList.Term>{item.term}</DescriptionList.Term>
            </DescriptionList.Group>
          )}
        </DescriptionList>
      );

      expect(getTerms()).toEqual(['Status', 'Assignee']);
      expect(screen.getByTestId('status')).not.toHaveAttribute('id');
      expect(screen.getByTestId('status')).not.toHaveAttribute('value');
    });

    it('should take the keys from the key of the items', () => {
      const items = [
        { key: 'status', term: 'Status' },
        { key: 'assignee', term: 'Assignee' },
      ];

      render(
        <DescriptionList items={items}>
          {(item) => (
            <DescriptionList.Group>
              <DescriptionList.Term>{item.term}</DescriptionList.Term>
            </DescriptionList.Group>
          )}
        </DescriptionList>
      );

      expect(getTerms()).toEqual(['Status', 'Assignee']);
    });

    it('should take the keys from the id of the groups', () => {
      const items = [{ term: 'Status' }, { term: 'Assignee' }];

      render(
        <DescriptionList items={items}>
          {(item) => (
            <DescriptionList.Group id={item.term}>
              <DescriptionList.Term>{item.term}</DescriptionList.Term>
            </DescriptionList.Group>
          )}
        </DescriptionList>
      );

      expect(getTerms()).toEqual(['Status', 'Assignee']);
    });

    it('should throw when an item has no key', () => {
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      expect(() =>
        render(
          <DescriptionList items={[{ term: 'Status' }]}>
            {(item) => (
              <DescriptionList.Group>
                <DescriptionList.Term>{item.term}</DescriptionList.Term>
              </DescriptionList.Group>
            )}
          </DescriptionList>
        )
      ).toThrow('Could not determine key for item');

      consoleError.mockRestore();
    });

    it('should re-render the groups when the dependencies change', () => {
      const items = [{ id: 'status', term: 'Status' }];

      const renderList = (suffix: string) => (
        <DescriptionList items={items} dependencies={[suffix]}>
          {(item) => (
            <DescriptionList.Group>
              <DescriptionList.Term>{`${item.term}-${suffix}`}</DescriptionList.Term>
            </DescriptionList.Group>
          )}
        </DescriptionList>
      );

      const { rerender } = render(renderList('a'));

      expect(getTerms()).toEqual(['Status-a']);

      rerender(renderList('b'));

      expect(getTerms()).toEqual(['Status-b']);
    });

    it('should render nothing for the children function without items', () => {
      render(
        <DescriptionList {...baseProps}>
          {() => (
            <DescriptionList.Group id="status">
              <DescriptionList.Term>Status</DescriptionList.Term>
            </DescriptionList.Group>
          )}
        </DescriptionList>
      );

      expect(getRoot()).toBeEmptyDOMElement();
    });
  });
});
