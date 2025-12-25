import { createRef, type ReactNode } from 'react';

import { screen, render, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi, expect, beforeEach } from 'vitest';

import { BreadcrumbItem, Breadcrumbs } from '../index';

const useHideOverflowItemsMock = vi.fn();

vi.mock('@koobiq/react-core', async () => {
  const actual = await vi.importActual<any>('@koobiq/react-core');

  return {
    ...actual,
    useHideOverflowItems: (args: any) => useHideOverflowItemsMock(args),
  };
});

describe('Breadcrumbs', () => {
  const baseProps = { 'data-testid': 'breadcrumbs' };

  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();

    useHideOverflowItemsMock.mockImplementation(
      ({ length }: { length: number }) => ({
        parentRef: { current: null },
        itemsRefs: Array.from({ length }, () => ({ current: null })),
        visibleMap: Array.from({ length }, () => true),
        parentSize: 0,
      })
    );
  });

  const getRoot = () => screen.getByTestId<HTMLElement>('breadcrumbs');

  it('should receive ref', () => {
    const ref = createRef<HTMLElement>();
    const { container } = render(<Breadcrumbs {...baseProps} ref={ref} />);
    const breadcrumbs = container.querySelector('nav');
    expect(ref.current).toBe(breadcrumbs);
  });

  it('should accept a custom class', () => {
    render(<Breadcrumbs {...baseProps} className="foo" />);

    expect(getRoot()).toHaveClass('foo');
  });

  it('should set custom style', () => {
    const style = { padding: 20 };

    const { container } = render(<Breadcrumbs style={style} />);

    const firstElement = container.firstChild;

    expect(firstElement).toHaveStyle({ padding: '20px' });
  });

  it('should provide size to items via context', () => {
    render(
      <Breadcrumbs {...baseProps} size="big">
        <BreadcrumbItem key="a">A</BreadcrumbItem>
        <BreadcrumbItem key="b">B</BreadcrumbItem>
      </Breadcrumbs>
    );

    const a = screen.getByText('A');
    const b = screen.getByText('B');

    expect(a).toHaveAttribute('data-size', 'big');
    expect(b).toHaveAttribute('data-size', 'big');
  });

  it('should call onAction with the item key and also call the original onPress', async () => {
    const onAction = vi.fn();
    const onPress = vi.fn();

    render(
      <Breadcrumbs {...baseProps} onAction={onAction}>
        <BreadcrumbItem key="a" onPress={onPress}>
          A
        </BreadcrumbItem>
        <BreadcrumbItem key="b">B</BreadcrumbItem>
      </Breadcrumbs>
    );

    await user.click(screen.getByText('A'));

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledTimes(1);
    expect(onAction).toHaveBeenCalledWith('a');
  });

  it('should fall back to index when key is not provided', async () => {
    const onAction = vi.fn();

    render(
      <Breadcrumbs {...baseProps} onAction={onAction}>
        <BreadcrumbItem>A</BreadcrumbItem>
        <BreadcrumbItem>B</BreadcrumbItem>
        <BreadcrumbItem>C</BreadcrumbItem>
      </Breadcrumbs>
    );

    await user.click(screen.getByText('B'));

    expect(onAction).toHaveBeenCalledWith(1);
  });

  describe('separator', () => {
    it('should render separators between items in wrap mode', () => {
      render(
        <Breadcrumbs
          overflowMode="wrap"
          separator={<span data-testid="sep">•</span>}
        >
          <BreadcrumbItem key="a">A</BreadcrumbItem>
          <BreadcrumbItem key="b">B</BreadcrumbItem>
          <BreadcrumbItem key="c">C</BreadcrumbItem>
        </Breadcrumbs>
      );

      expect(screen.getAllByTestId('sep')).toHaveLength(2);
    });

    it('should render separators for each slot in collapse mode', () => {
      render(
        <Breadcrumbs
          overflowMode="collapse"
          separator={<span data-testid="sep">•</span>}
        >
          {[
            <BreadcrumbItem key="a">A</BreadcrumbItem>,
            <BreadcrumbItem key="b">B</BreadcrumbItem>,
            <BreadcrumbItem key="c">C</BreadcrumbItem>,
          ]}
        </Breadcrumbs>
      );

      expect(screen.getAllByTestId('sep')).toHaveLength(3);
    });
  });

  describe('renderEllipsis', () => {
    it('should call renderEllipsis with collapsed items based on visibility map', () => {
      useHideOverflowItemsMock.mockReturnValueOnce({
        parentRef: { current: null },
        itemsRefs: Array.from({ length: 4 }, () => ({ current: null })),
        visibleMap: [true, true, false, true],
        parentSize: 0,
      });

      const onAction = vi.fn();

      const renderEllipsis = vi.fn<(args: any) => ReactNode>(() => (
        <span data-testid="custom-ellipsis">More</span>
      ));

      render(
        <Breadcrumbs
          overflowMode="collapse"
          ellipsisIndex={1}
          onAction={onAction}
          renderEllipsis={renderEllipsis}
          data-testid="breadcrumbs"
        >
          <BreadcrumbItem key="a">A</BreadcrumbItem>
          <BreadcrumbItem key="b">B</BreadcrumbItem>
          <BreadcrumbItem key="c">C</BreadcrumbItem>
        </Breadcrumbs>
      );

      expect(renderEllipsis).toHaveBeenCalledTimes(1);

      const arg = renderEllipsis.mock.calls?.[0]?.[0];

      expect(arg?.ellipsisIndex).toBe(1);
      expect(arg.onAction).toBe(onAction);
      expect(arg.ellipsisIcon).toBeTruthy();

      expect(arg.items).toHaveLength(1);
      expect(arg.items[0].children).toBe('B');
    });

    it('should keep the ellipsis slot in the DOM but hide it when its slot is not visible', () => {
      useHideOverflowItemsMock.mockReturnValueOnce({
        parentRef: { current: null },
        itemsRefs: Array.from({ length: 4 }, () => ({ current: null })),
        visibleMap: [true, false, true, true],
        parentSize: 0,
      });

      const renderEllipsis = vi.fn(() => (
        <span data-testid="custom-ellipsis">More</span>
      ));

      render(
        <Breadcrumbs
          overflowMode="collapse"
          ellipsisIndex={1}
          renderEllipsis={renderEllipsis}
        >
          <BreadcrumbItem key="a">A</BreadcrumbItem>
          <BreadcrumbItem key="b">B</BreadcrumbItem>
          <BreadcrumbItem key="c">C</BreadcrumbItem>
        </Breadcrumbs>
      );

      const ellipsis = screen.getByTestId('custom-ellipsis');
      expect(ellipsis).toBeInTheDocument();

      const li = ellipsis.closest('li');
      expect(li).toBeTruthy();
      expect(li!).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('should update ellipsisIndex when the prop changes', () => {
    useHideOverflowItemsMock.mockImplementation(
      ({ length }: { length: number }) => ({
        parentRef: { current: null },
        itemsRefs: Array.from({ length }, () => ({ current: null })),
        visibleMap: Array.from({ length }, () => true),
        parentSize: 0,
      })
    );

    const renderEllipsis = vi.fn<(args: any) => ReactNode>(() => null);

    const { rerender } = render(
      <Breadcrumbs
        overflowMode="collapse"
        ellipsisIndex={1}
        renderEllipsis={renderEllipsis}
      >
        <BreadcrumbItem key="a">A</BreadcrumbItem>
        <BreadcrumbItem key="b">B</BreadcrumbItem>
        <BreadcrumbItem key="c">C</BreadcrumbItem>
      </Breadcrumbs>
    );

    expect(renderEllipsis.mock.calls[0]![0].ellipsisIndex).toBe(1);

    rerender(
      <Breadcrumbs
        overflowMode="collapse"
        ellipsisIndex={2}
        renderEllipsis={renderEllipsis}
      >
        <BreadcrumbItem key="a">A</BreadcrumbItem>
        <BreadcrumbItem key="b">B</BreadcrumbItem>
        <BreadcrumbItem key="c">C</BreadcrumbItem>
      </Breadcrumbs>
    );

    expect(renderEllipsis.mock.calls[1]![0].ellipsisIndex).toBe(2);
  });

  describe('renderEllipsisDefault', () => {
    it('should pass label and href into the default ellipsis menu item', async () => {
      useHideOverflowItemsMock.mockReturnValueOnce({
        parentRef: { current: null },
        itemsRefs: Array.from({ length: 4 }, () => ({ current: null })),
        visibleMap: [true, true, false, true],
        parentSize: 0,
      });

      render(
        <Breadcrumbs overflowMode="collapse" ellipsisIndex={1}>
          <BreadcrumbItem key="a" href="/a">
            A
          </BreadcrumbItem>
          <BreadcrumbItem key="b" href="/b">
            B
          </BreadcrumbItem>
          <BreadcrumbItem key="c" href="/c">
            C
          </BreadcrumbItem>
        </Breadcrumbs>
      );

      await user.click(screen.getByRole('button'));

      const menu = await screen.findByRole('menu');
      const item = within(menu).getByRole('menuitem', { name: /^B$/ });

      expect(item).toHaveTextContent('B');

      expect(item).toHaveAttribute('href', '/b');
    });
  });
});
