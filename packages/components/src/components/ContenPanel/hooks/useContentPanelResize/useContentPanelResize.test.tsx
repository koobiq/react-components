import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useContentPanelResize } from './useContentPanelResize';

type MoveConfig = {
  onMoveStart?: () => void;
  onMoveEnd?: () => void;
  onMove?: (e: { deltaX: number; deltaY?: number }) => void;
};

let lastMoveConfig: MoveConfig | null = null;

vi.mock('@koobiq/react-core', async (importOriginal) => {
  const React = await import('react');
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  const actual = await importOriginal<typeof import('@koobiq/react-core')>();

  const isNumber = (v: unknown): v is number =>
    typeof v === 'number' && Number.isFinite(v);

  // merge props + chain event handlers if both exist
  const mergeProps = (...args: any[]) => {
    const out: any = {};

    for (const obj of args) {
      // eslint-disable-next-line no-continue
      if (!obj) continue;

      for (const key of Object.keys(obj)) {
        const next = obj[key];
        const prev = out[key];

        if (typeof prev === 'function' && typeof next === 'function') {
          out[key] = (...a: any[]) => {
            prev(...a);
            next(...a);
          };
        } else {
          out[key] = next;
        }
      }
    }

    return out;
  };

  const useControlledState = (
    controlled: number | undefined,
    defaultValue: number,
    onChange?: (v: number) => void
  ) => {
    const [uncontrolled, setUncontrolled] = React.useState(defaultValue);
    const value = controlled ?? uncontrolled;

    const setValue = (updater: number | ((v: number) => number)) => {
      const next =
        typeof updater === 'function'
          ? (updater as (v: number) => number)(value)
          : updater;

      if (controlled === undefined) {
        setUncontrolled(next);
      }

      onChange?.(next);
    };

    return [value, setValue] as const;
  };

  const useMove = (cfg: MoveConfig) => {
    lastMoveConfig = cfg;

    return { moveProps: {} as any };
  };

  const useLocalizedStringFormatter = () => ({
    format: (key: string) => (key === 'resize panel' ? 'Resize panel' : key),
  });

  return {
    ...actual,
    isNumber,
    mergeProps,
    useControlledState,
    useMove,
    useLocalizedStringFormatter,
  };
});

describe('useContentPanelResize', () => {
  beforeEach(() => {
    lastMoveConfig = null;
    delete document.body.dataset.resizing;
  });

  it('returns aria-hidden resizer props when not resizable', () => {
    const { result } = renderHook(() =>
      useContentPanelResize({
        isResizable: false,
        defaultWidth: 400,
      })
    );

    expect(result.current.width).toBeUndefined();
    expect(result.current.resizerProps.tabIndex).toBe(-1);
    expect(result.current.resizerProps['aria-hidden']).toBe('true');
    expect(result.current.resizerProps.onDoubleClick).toBeUndefined();
  });

  it('returns width and aria props when resizable (uncontrolled)', () => {
    const { result } = renderHook(() =>
      useContentPanelResize({
        isResizable: true,
        defaultWidth: 400,
        minWidth: 200,
        maxWidth: 800,
      })
    );

    expect(result.current.width).toBe(400);
    expect(result.current.resizerProps['aria-label']).toBe('Resize panel');
    expect(result.current.resizerProps['aria-valuenow']).toBe(400);
    expect(result.current.resizerProps['aria-valuemin']).toBe(200);
    expect(result.current.resizerProps['aria-valuemax']).toBe(800);
    expect(typeof result.current.resizerProps.onDoubleClick).toBe('function');
  });

  it('sets body.dataset.resizing and calls onResizeStart with current width', () => {
    const onResizeStart = vi.fn();

    renderHook(() =>
      useContentPanelResize({
        isResizable: true,
        defaultWidth: 410.2,
        onResizeStart,
      })
    );

    act(() => {
      lastMoveConfig?.onMoveStart?.();
    });

    expect(document.body.dataset.resizing).toBe('true');
    expect(onResizeStart).toHaveBeenCalledWith(410);
  });

  it('updates width on move and clamps to min/max; calls onResize with next', () => {
    const onResize = vi.fn();

    const { result } = renderHook(() =>
      useContentPanelResize({
        isResizable: true,
        defaultWidth: 400,
        minWidth: 300,
        maxWidth: 450,
        onResize,
      })
    );

    // drag left (deltaX negative) => width increases
    act(() => {
      lastMoveConfig?.onMove?.({ deltaX: -100 });
    });

    // 400 - (-100) = 500 -> clamped to 450
    expect(onResize).toHaveBeenLastCalledWith(450);
    expect(result.current.width).toBe(450);

    // drag right (deltaX positive) => width decreases
    act(() => {
      lastMoveConfig?.onMove?.({ deltaX: 200 });
    });

    // 450 - 200 = 250 -> clamped to 300
    expect(onResize).toHaveBeenLastCalledWith(300);
    expect(result.current.width).toBe(300);
  });

  it('clears body.dataset.resizing and calls onResizeEnd with final width', () => {
    const onResizeEnd = vi.fn();

    renderHook(() =>
      useContentPanelResize({
        isResizable: true,
        defaultWidth: 400,
        onResizeEnd,
      })
    );

    act(() => {
      lastMoveConfig?.onMoveStart?.();
      lastMoveConfig?.onMove?.({ deltaX: -33 }); // 433
      lastMoveConfig?.onMoveEnd?.();
    });

    expect(document.body.dataset.resizing).toBeUndefined();
    expect(onResizeEnd).toHaveBeenCalledWith(433);
  });

  it('double click resets to initial width when onResetResize returns nothing', () => {
    const onResize = vi.fn();

    const { result } = renderHook(() =>
      useContentPanelResize({
        isResizable: true,
        defaultWidth: 400,
        onResize,
        onResetResize: () => undefined,
      })
    );

    // change width
    act(() => {
      lastMoveConfig?.onMove?.({ deltaX: -50 }); // 450
    });

    expect(result.current.width).toBe(450);

    // reset
    act(() => {
      (result.current.resizerProps.onDoubleClick as any)?.();
    });

    expect(onResize).toHaveBeenLastCalledWith(400);
    expect(result.current.width).toBe(400);
  });

  it('double click applies onResetResize return value (clamped)', () => {
    const onResize = vi.fn();

    const { result } = renderHook(() =>
      useContentPanelResize({
        isResizable: true,
        defaultWidth: 400,
        minWidth: 200,
        maxWidth: 450,
        onResize,
        onResetResize: () => 999, // should clamp to 450
      })
    );

    act(() => {
      (result.current.resizerProps.onDoubleClick as any)?.();
    });

    expect(onResize).toHaveBeenLastCalledWith(450);
    expect(result.current.width).toBe(450);
  });

  it('initial reset width is taken from first width prop and does not change after rerender', () => {
    const onResize = vi.fn();

    const { result, rerender } = renderHook(
      (p: { width?: number | null }) =>
        useContentPanelResize({
          isResizable: true,
          width: p.width,
          defaultWidth: 400,
          minWidth: 0,
          maxWidth: 1000,
          onResize,
        }),
      { initialProps: { width: 600 } }
    );

    // rerender with new controlled width
    rerender({ width: 300 });

    // reset should go to initial (600), not to 300
    act(() => {
      (result.current.resizerProps.onDoubleClick as any)?.();
    });

    expect(onResize).toHaveBeenLastCalledWith(600);
  });
});
