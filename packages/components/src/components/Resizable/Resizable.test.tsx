import { createRef, type ComponentProps } from 'react';

import type * as ReactCore from '@koobiq/react-core';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { Provider } from '../Provider';

import {
  Resizable,
  resizableHandleDirections,
  type ResizableHandleDirection,
  type ResizableSize,
} from './index.js';

const mocks = vi.hoisted(() => ({
  observedSize: { width: 300, height: 200 },
}));

vi.mock('@koobiq/react-core', async () => {
  const React = await import('react');
  const actual = await vi.importActual<typeof ReactCore>('@koobiq/react-core');

  return {
    ...actual,
    useElementSize: () => ({
      ref: React.useRef<HTMLDivElement>(null),
      width: mocks.observedSize.width,
      height: mocks.observedSize.height,
    }),
  };
});

const getRoot = () => screen.getByTestId<HTMLDivElement>('resizable');
const getHandle = () => screen.getByTestId<HTMLDivElement>('handle');

const renderResizable = (
  direction: ResizableHandleDirection = [1, 1],
  props: Partial<ComponentProps<typeof Resizable>> = {}
) =>
  render(
    <Resizable
      data-testid="resizable"
      defaultSize={{ width: 300, height: 200 }}
      {...props}
    >
      content
      <Resizable.Handle data-testid="handle" direction={direction} />
    </Resizable>
  );

const drag = (deltaX: number, deltaY: number) => {
  fireEvent.mouseDown(getHandle(), { button: 0, clientX: 10, clientY: 10 });

  fireEvent.mouseMove(window, {
    button: 0,
    clientX: 10 + deltaX,
    clientY: 10 + deltaY,
  });

  fireEvent.mouseUp(window, {
    button: 0,
    clientX: 10 + deltaX,
    clientY: 10 + deltaY,
  });
};

describe('Resizable', () => {
  beforeEach(() => {
    mocks.observedSize = { width: 300, height: 200 };
    vi.stubGlobal('PointerEvent', undefined);

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function getBoundingClientRect(this: HTMLElement) {
        const width = Number.parseFloat(this.style.width);
        const height = Number.parseFloat(this.style.height);

        const resolvedWidth = Number.isNaN(width)
          ? mocks.observedSize.width
          : width;

        const resolvedHeight = Number.isNaN(height)
          ? mocks.observedSize.height
          : height;

        return {
          x: 0,
          y: 0,
          top: 0,
          left: 0,
          right: resolvedWidth,
          bottom: resolvedHeight,
          width: resolvedWidth,
          height: resolvedHeight,
          toJSON: () => ({}),
        };
      }
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('forwards refs and merges consumer props', () => {
    const rootRef = createRef<HTMLDivElement>();
    const handleRef = createRef<HTMLDivElement>();
    const onKeyDown = vi.fn();

    render(
      <Resizable
        ref={rootRef}
        data-testid="resizable"
        defaultSize={{ width: 300, height: 200 }}
        className="custom-root"
        style={{ color: 'red' }}
      >
        <Resizable.Handle
          ref={handleRef}
          data-testid="handle"
          direction={[1, 0]}
          className="custom-handle"
          onKeyDown={onKeyDown}
        />
      </Resizable>
    );

    fireEvent.keyDown(getHandle(), { key: 'ArrowRight' });

    expect(rootRef.current).toBe(getRoot());
    expect(handleRef.current).toBe(getHandle());
    expect(getRoot()).toHaveClass('custom-root');
    expect(getRoot().style.color).toBe('red');
    expect(getHandle()).toHaveClass('custom-handle');
    expect(onKeyDown).toHaveBeenCalledOnce();
  });

  it.each(resizableHandleDirections)(
    'resizes in direction [%s, %s] from the drag snapshot',
    (x, y) => {
      renderResizable([x, y] as ResizableHandleDirection);

      drag(20, 15);

      expect(getRoot()).toHaveStyle({
        width: `${300 + 20 * x}px`,
        height: `${200 + 15 * y}px`,
      });

      expect(getRoot().style.top).toBe('');
      expect(getRoot().style.left).toBe('');
      expect(getRoot().style.transform).toBe('');
    }
  );

  it('accumulates movement without applying total deltas more than once', () => {
    renderResizable([1, 1]);

    fireEvent.mouseDown(getHandle(), { button: 0, clientX: 10, clientY: 10 });

    fireEvent.mouseMove(window, {
      button: 0,
      clientX: 30,
      clientY: 20,
    });

    fireEvent.mouseMove(window, {
      button: 0,
      clientX: 40,
      clientY: 30,
    });

    fireEvent.mouseUp(window, { button: 0, clientX: 40, clientY: 30 });

    expect(getRoot()).toHaveStyle({ width: '330px', height: '220px' });
  });

  it('clamps sizes and preserves the drag relationship beyond a boundary', () => {
    renderResizable([1, 0], {
      minSize: { width: 280 },
      maxSize: { width: 320 },
    });

    fireEvent.mouseDown(getHandle(), { button: 0, clientX: 0, clientY: 0 });
    fireEvent.mouseMove(window, { button: 0, clientX: 50, clientY: 0 });
    expect(getRoot()).toHaveStyle({ width: '320px', height: '200px' });

    fireEvent.mouseMove(window, { button: 0, clientX: 40, clientY: 0 });
    expect(getRoot()).toHaveStyle({ width: '320px', height: '200px' });

    fireEvent.mouseMove(window, { button: 0, clientX: 10, clientY: 0 });
    expect(getRoot()).toHaveStyle({ width: '310px', height: '200px' });
  });

  it('lets minimum constraints win over maximum constraints', () => {
    renderResizable([1, 0], {
      defaultSize: { width: 150, height: 200 },
      minSize: { width: 200 },
      maxSize: { width: 100 },
    });

    expect(getRoot()).toHaveStyle({
      width: '200px',
      minWidth: '200px',
      maxWidth: '200px',
    });
  });

  it('normalizes negative and non-finite sizes to the minimum', () => {
    renderResizable([1, 0], {
      defaultSize: { width: Number.NaN, height: -20 },
      minSize: { width: 40, height: 30 },
    });

    expect(getRoot()).toHaveStyle({ width: '40px', height: '30px' });
  });

  it('supports controlled state without optimistically changing the DOM size', () => {
    const onResize = vi.fn();
    const initialSize = { width: 300, height: 200 };

    const { rerender } = render(
      <Resizable data-testid="resizable" size={initialSize} onResize={onResize}>
        <Resizable.Handle data-testid="handle" direction={[1, 1]} />
      </Resizable>
    );

    drag(20, 10);

    expect(onResize).toHaveBeenLastCalledWith({ width: 320, height: 210 });
    expect(getRoot()).toHaveStyle({ width: '300px', height: '200px' });

    const nextSize = onResize.mock.lastCall?.[0] as ResizableSize;

    rerender(
      <Resizable data-testid="resizable" size={nextSize} onResize={onResize}>
        <Resizable.Handle data-testid="handle" direction={[1, 1]} />
      </Resizable>
    );

    expect(getRoot()).toHaveStyle({ width: '320px', height: '210px' });
  });

  it('preserves intrinsic sizing until the first resize', () => {
    mocks.observedSize = { width: 260, height: 140 };
    renderResizable([1, 0], { defaultSize: undefined });

    expect(getRoot().style.width).toBe('');
    expect(getRoot().style.height).toBe('');
    expect(getHandle()).toHaveAttribute('aria-valuenow', '260');

    fireEvent.keyDown(getHandle(), { key: 'ArrowRight' });

    expect(getRoot()).toHaveStyle({ width: '261px', height: '140px' });
  });

  it('calls lifecycle callbacks with the snapshot and final size', () => {
    const onResizeStart = vi.fn();
    const onResizeEnd = vi.fn();

    renderResizable([1, 1], { onResizeStart, onResizeEnd });
    drag(25, 10);

    expect(onResizeStart).toHaveBeenCalledOnce();
    expect(onResizeStart).toHaveBeenCalledWith({ width: 300, height: 200 });
    expect(onResizeEnd).toHaveBeenCalledOnce();
    expect(onResizeEnd).toHaveBeenCalledWith({ width: 325, height: 210 });
    expect(getRoot()).not.toHaveAttribute('data-resizing');
  });

  it('supports Pointer Events and exposes the active resize state', () => {
    vi.stubGlobal('PointerEvent', MouseEvent);
    renderResizable([1, 1]);

    fireEvent.pointerDown(getHandle(), {
      button: 0,
      pointerId: 1,
      pointerType: 'touch',
      clientX: 10,
      clientY: 10,
    });

    fireEvent.pointerMove(window, {
      button: 0,
      pointerId: 1,
      pointerType: 'touch',
      clientX: 30,
      clientY: 25,
    });

    expect(getRoot()).toHaveStyle({ width: '320px', height: '215px' });
    expect(getRoot()).toHaveAttribute('data-resizing', 'true');
    expect(getHandle()).toHaveAttribute('data-resizing', 'true');

    fireEvent.pointerUp(window, {
      button: 0,
      pointerId: 1,
      pointerType: 'touch',
      clientX: 30,
      clientY: 25,
    });

    expect(getRoot()).not.toHaveAttribute('data-resizing');
  });

  it('supports touch events when Pointer Events are unavailable', () => {
    renderResizable([-1, -1]);

    fireEvent.touchStart(getHandle(), {
      changedTouches: [{ identifier: 7, pageX: 20, pageY: 20 }],
    });

    fireEvent.touchMove(window, {
      changedTouches: [{ identifier: 7, pageX: 30, pageY: 25 }],
    });

    fireEvent.touchEnd(window, {
      changedTouches: [{ identifier: 7, pageX: 30, pageY: 25 }],
    });

    expect(getRoot()).toHaveStyle({ width: '290px', height: '195px' });
  });

  it('resizes by one pixel with arrows and ten pixels with Shift', () => {
    renderResizable([1, 0]);

    fireEvent.keyDown(getHandle(), { key: 'ArrowRight' });
    expect(getRoot()).toHaveStyle({ width: '301px', height: '200px' });

    fireEvent.keyDown(getHandle(), { key: 'ArrowRight', shiftKey: true });
    expect(getRoot()).toHaveStyle({ width: '311px', height: '200px' });
  });

  it('disables interactions and removes handles from the tab order', () => {
    const onResize = vi.fn();
    renderResizable([1, 0], { isDisabled: true, onResize });

    fireEvent.keyDown(getHandle(), { key: 'ArrowRight' });
    drag(20, 0);

    expect(onResize).not.toHaveBeenCalled();
    expect(getRoot()).toHaveAttribute('data-disabled', 'true');
    expect(getHandle()).toHaveAttribute('data-disabled', 'true');
    expect(getHandle()).toHaveAttribute('aria-disabled', 'true');
    expect(getHandle()).toHaveAttribute('tabindex', '-1');
  });

  it('exposes separator semantics for edge handles', () => {
    renderResizable([1, 0], {
      minSize: { width: 200 },
      maxSize: { width: 500 },
    });

    expect(getHandle()).toHaveAttribute('role', 'separator');
    expect(getHandle()).toHaveAttribute('aria-orientation', 'vertical');
    expect(getHandle()).toHaveAttribute('aria-valuenow', '300');
    expect(getHandle()).toHaveAttribute('aria-valuemin', '200');
    expect(getHandle()).toHaveAttribute('aria-valuemax', '500');
    expect(getHandle()).toHaveAttribute('aria-controls', getRoot().id);
    expect(getHandle()).toHaveAttribute('aria-label', 'Resize width');
  });

  it('exposes button semantics for corner handles and allows a custom label', () => {
    render(
      <Resizable
        data-testid="resizable"
        defaultSize={{ width: 300, height: 200 }}
      >
        <Resizable.Handle
          data-testid="handle"
          direction={[1, 1]}
          aria-label="Resize preview"
        />
      </Resizable>
    );

    expect(getHandle()).toHaveAttribute('role', 'button');
    expect(getHandle()).toHaveAttribute('aria-label', 'Resize preview');

    expect(getHandle()).toHaveAttribute(
      'aria-keyshortcuts',
      'ArrowUp ArrowDown ArrowLeft ArrowRight'
    );

    expect(getHandle()).not.toHaveAttribute('aria-valuenow');
    expect(getHandle()).toHaveAttribute('aria-controls', getRoot().id);
  });

  it('localizes default accessible labels', () => {
    render(
      <Provider locale="ru-RU">
        <Resizable
          data-testid="resizable"
          defaultSize={{ width: 300, height: 200 }}
        >
          <Resizable.Handle data-testid="handle" direction={[0, 1]} />
        </Resizable>
      </Provider>
    );

    expect(getHandle()).toHaveAttribute('aria-label', 'Изменить высоту');
  });

  it('positions handles using physical coordinates', () => {
    renderResizable([-1, 1]);

    expect(getHandle().style.left).toBe('0px');
    expect(getHandle().style.bottom).toBe('0px');
    expect(getHandle().style.transform).toBe('translate(-50%, 50%)');
    expect(getHandle()).toHaveAttribute('data-direction-x', '-1');
    expect(getHandle()).toHaveAttribute('data-direction-y', '1');
  });

  it('throws when a handle is rendered without Resizable', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() => render(<Resizable.Handle direction={[1, 0]} />)).toThrow(
      'Resizable.Handle must be rendered inside Resizable.'
    );
  });

  it('throws for an invalid runtime direction', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    expect(() =>
      render(
        <Resizable defaultSize={{ width: 300, height: 200 }}>
          <Resizable.Handle
            direction={[0, 0] as unknown as ResizableHandleDirection}
          />
        </Resizable>
      )
    ).toThrow('eight non-zero [x, y] directions');
  });
});
