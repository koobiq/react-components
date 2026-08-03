import { createRef } from 'react';

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  TopBar,
  topBarPropPosition,
  topBarContainerPropPlacement,
} from './index.js';

describe('TopBar', () => {
  const baseProps = { 'data-testid': 'top-bar' };

  const getRoot = () => screen.getByTestId<HTMLElement>('top-bar');

  it('should accept the ref', () => {
    const ref = createRef<HTMLElement>();

    render(<TopBar {...baseProps} ref={ref} />);

    expect(ref.current).toBe(getRoot());
  });

  it('should render as a header by default', () => {
    render(<TopBar {...baseProps} />);

    expect(getRoot().tagName).toBe('HEADER');
  });

  it('should support the polymorphic "as" prop', () => {
    render(<TopBar {...baseProps} as="div" />);

    expect(getRoot().tagName).toBe('DIV');
  });

  it('should merge a custom class name with the default ones', () => {
    render(<TopBar {...baseProps} className="foo" />);

    expect(getRoot()).toHaveClass('foo');
  });

  it('should merge the consumer style', () => {
    render(<TopBar {...baseProps} style={{ color: 'red' }} />);

    expect(getRoot().style.color).toBe('red');
  });

  it('should spread additional HTML props onto the root element', () => {
    render(<TopBar {...baseProps} id="page-top-bar" aria-label="Page" />);

    const root = getRoot();

    expect(root).toHaveAttribute('id', 'page-top-bar');
    expect(root).toHaveAttribute('aria-label', 'Page');
  });

  it('should render the subcomponents', () => {
    render(
      <TopBar {...baseProps}>
        <TopBar.Container data-testid="start">
          <TopBar.Title data-testid="title">Dashboards</TopBar.Title>
        </TopBar.Container>
        <TopBar.Container data-testid="end" placement="end">
          <button type="button">Create</button>
        </TopBar.Container>
      </TopBar>
    );

    expect(screen.getByTestId('start')).toBeInTheDocument();
    expect(screen.getByTestId('end')).toBeInTheDocument();
    expect(screen.getByTestId('title')).toHaveTextContent('Dashboards');
  });

  describe('check the position prop', () => {
    it('should be sticky by default', () => {
      render(<TopBar {...baseProps} />);

      expect(getRoot()).toHaveAttribute('data-position', 'sticky');
    });

    it.each(topBarPropPosition)(
      'should apply the position "%s"',
      (position) => {
        render(<TopBar {...baseProps} position={position} />);

        expect(getRoot()).toHaveAttribute('data-position', position);
      }
    );

    it('should not allow data-position to override position', () => {
      render(
        <TopBar {...baseProps} position="sticky" data-position="static" />
      );

      expect(getRoot()).toHaveAttribute('data-position', 'sticky');
    });
  });

  describe('check the hasShadow prop', () => {
    it('should hide the shadow by default', () => {
      render(<TopBar {...baseProps} />);

      expect(getRoot()).not.toHaveAttribute('data-shadow');
    });

    it('should set data-shadow when hasShadow is true', () => {
      render(<TopBar {...baseProps} hasShadow />);

      expect(getRoot()).toHaveAttribute('data-shadow', 'true');
    });

    it('should not allow data-shadow to override hasShadow', () => {
      render(<TopBar {...baseProps} data-shadow="true" />);

      expect(getRoot()).not.toHaveAttribute('data-shadow');
    });
  });
});

describe('TopBar.Container', () => {
  const baseProps = { 'data-testid': 'container' };

  const getRoot = () => screen.getByTestId<HTMLDivElement>('container');

  it('should accept the ref', () => {
    const ref = createRef<HTMLDivElement>();

    render(<TopBar.Container {...baseProps} ref={ref} />);

    expect(ref.current).toBe(getRoot());
  });

  it('should merge a custom class name with the default ones', () => {
    render(<TopBar.Container {...baseProps} className="foo" />);

    expect(getRoot()).toHaveClass('foo');
  });

  it('should support the polymorphic "as" prop', () => {
    render(<TopBar.Container {...baseProps} as="nav" />);

    expect(getRoot().tagName).toBe('NAV');
  });

  it('should be placed at the start by default', () => {
    render(<TopBar.Container {...baseProps} />);

    expect(getRoot()).toHaveAttribute('data-placement', 'start');
  });

  it.each(topBarContainerPropPlacement)(
    'should apply the placement "%s"',
    (placement) => {
      render(<TopBar.Container {...baseProps} placement={placement} />);

      expect(getRoot()).toHaveAttribute('data-placement', placement);
    }
  );

  it('should not allow data-placement to override placement', () => {
    render(
      <TopBar.Container {...baseProps} placement="end" data-placement="start" />
    );

    expect(getRoot()).toHaveAttribute('data-placement', 'end');
  });

  describe('check the isToolbar prop', () => {
    it('should add no toolbar semantics by default', () => {
      render(<TopBar.Container {...baseProps} />);

      const container = getRoot();

      expect(container).not.toHaveAttribute('role');
      expect(container).not.toHaveAttribute('aria-orientation');
    });

    it('should add the toolbar semantics when isToolbar is true', () => {
      render(
        <TopBar.Container {...baseProps} isToolbar aria-label="Page actions" />
      );

      const container = getRoot();

      expect(container).toHaveAttribute('role', 'toolbar');
      expect(container).toHaveAttribute('aria-orientation', 'horizontal');
      expect(container).toHaveAttribute('aria-label', 'Page actions');
    });

    it('should keep aria-label without the toolbar semantics', () => {
      render(<TopBar.Container {...baseProps} aria-label="Page actions" />);

      expect(getRoot()).toHaveAttribute('aria-label', 'Page actions');
    });

    it('should move focus between the actions with the arrow keys', async () => {
      render(
        <TopBar.Container {...baseProps} isToolbar aria-label="Page actions">
          <button type="button">Share</button>
          <button type="button">Apply</button>
        </TopBar.Container>
      );

      const share = screen.getByRole('button', { name: 'Share' });
      const apply = screen.getByRole('button', { name: 'Apply' });

      await userEvent.tab();

      expect(share).toHaveFocus();

      await userEvent.keyboard('{ArrowRight}');

      expect(apply).toHaveFocus();

      await userEvent.keyboard('{ArrowLeft}');

      expect(share).toHaveFocus();
    });
  });
});

describe('TopBar.Title', () => {
  const baseProps = { 'data-testid': 'title' };

  const getRoot = () => screen.getByTestId<HTMLHeadingElement>('title');

  it('should accept the ref', () => {
    const ref = createRef<HTMLHeadingElement>();

    render(<TopBar.Title {...baseProps} ref={ref} />);

    expect(ref.current).toBe(getRoot());
  });

  it('should render as an h1 with the content by default', () => {
    render(<TopBar.Title {...baseProps}>Dashboards</TopBar.Title>);

    const title = getRoot();

    expect(title.tagName).toBe('H1');
    expect(title).toHaveTextContent('Dashboards');
  });

  it('should support the polymorphic "as" prop', () => {
    render(<TopBar.Title {...baseProps} as="h2" />);

    expect(getRoot().tagName).toBe('H2');
  });

  it('should merge a custom class name with the default ones', () => {
    render(<TopBar.Title {...baseProps} className="foo" />);

    expect(getRoot()).toHaveClass('foo');
  });
});
