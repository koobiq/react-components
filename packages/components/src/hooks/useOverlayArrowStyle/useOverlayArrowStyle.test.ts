import type { CSSProperties } from 'react';

import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  getOverlayArrowStyle,
  useOverlayArrowStyle,
} from './useOverlayArrowStyle';

const createRect = ({
  height = 64,
  left = 0,
  top = 0,
  width = 64,
}: {
  height?: number;
  left?: number;
  top?: number;
  width?: number;
} = {}) => ({
  bottom: top + height,
  left,
  right: left + width,
  top,
});

const overlayRect = createRect();
const targetRect = createRect();

describe('getOverlayArrowStyle', () => {
  it.each([
    ['top start', 'left', 16],
    ['bottom start', 'left', 16],
    ['top end', 'left', 'calc(100% - 16px)'],
    ['bottom end', 'left', 'calc(100% - 16px)'],
    ['start top', 'top', 16],
    ['end top', 'top', 16],
    ['start bottom', 'top', 'calc(100% - 16px)'],
    ['end bottom', 'top', 'calc(100% - 16px)'],
  ] as const)(
    'should align the arrow for the "%s" placement',
    (placement, property, value) => {
      expect(
        getOverlayArrowStyle({
          placement,
          direction: 'ltr',
          arrowBoundaryOffset: 16,
          overlayRect,
          targetRect,
        })
      ).toMatchObject({ [property]: value });
    }
  );

  it.each([
    ['top start', 'bottom start'],
    ['top end', 'bottom end'],
    ['start top', 'end top'],
    ['start bottom', 'end bottom'],
  ] as const)(
    'should preserve the arrow alignment when "%s" flips to "%s"',
    (placement, flippedPlacement) => {
      const options = {
        direction: 'ltr' as const,
        arrowBoundaryOffset: 16,
        overlayRect,
        targetRect,
      };

      expect(
        getOverlayArrowStyle({ ...options, placement: flippedPlacement })
      ).toEqual(getOverlayArrowStyle({ ...options, placement }));
    }
  );

  it.each(['top', 'bottom', 'start', 'end'])(
    'should preserve React Aria centering for the "%s" placement',
    (placement) => {
      expect(
        getOverlayArrowStyle({
          placement,
          direction: 'ltr',
          arrowBoundaryOffset: 16,
        })
      ).toBeUndefined();
    }
  );

  it.each([
    ['top start', 'calc(100% - 16px)'],
    ['bottom start', 'calc(100% - 16px)'],
    ['top end', 16],
    ['bottom end', 16],
  ] as const)(
    'should use the "%s" logical alignment in RTL',
    (placement, left) => {
      expect(
        getOverlayArrowStyle({
          placement,
          direction: 'rtl',
          arrowBoundaryOffset: 16,
          overlayRect,
          targetRect,
        })
      ).toMatchObject({ left });
    }
  );

  it('should apply a custom arrow boundary offset', () => {
    expect(
      getOverlayArrowStyle({
        direction: 'ltr',
        placement: 'top start',
        arrowBoundaryOffset: 24,
        overlayRect,
        targetRect,
      })
    ).toMatchObject({ left: 24 });
  });

  it.each([
    [
      'top start',
      createRect({ left: 100 }),
      createRect({ left: 0, width: 32 }),
    ],
    ['top end', createRect({ left: 0 }), createRect({ left: 100, width: 32 })],
    ['start top', createRect({ top: 100 }), createRect({ height: 32, top: 0 })],
    [
      'start bottom',
      createRect({ top: 0 }),
      createRect({ height: 32, top: 100 }),
    ],
  ] as const)(
    'should preserve React Aria positioning when the "%s" arrow would miss the target',
    (placement, shiftedOverlayRect, shiftedTargetRect) => {
      expect(
        getOverlayArrowStyle({
          placement,
          direction: 'ltr',
          arrowBoundaryOffset: 16,
          overlayRect: shiftedOverlayRect,
          targetRect: shiftedTargetRect,
        })
      ).toBeUndefined();
    }
  );

  it.each([-1, 65])(
    'should not apply an offset of %spx outside the overlay',
    (arrowBoundaryOffset) => {
      expect(
        getOverlayArrowStyle({
          direction: 'ltr',
          placement: 'top start',
          arrowBoundaryOffset,
          overlayRect,
          targetRect: createRect({ left: -10, width: 84 }),
        })
      ).toBeUndefined();
    }
  );

  it('should use the fixed offset when the arrow still points at the target after a shift', () => {
    expect(
      getOverlayArrowStyle({
        direction: 'ltr',
        placement: 'top start',
        arrowBoundaryOffset: 16,
        overlayRect: createRect({ left: 12 }),
        targetRect: createRect({ width: 40 }),
      })
    ).toMatchObject({ left: 16 });
  });
});

const rect = {
  bottom: 64,
  left: 0,
  right: 64,
  top: 0,
} as DOMRect;

const createRef = () => ({
  current: {
    getBoundingClientRect: vi.fn(() => rect),
  } as unknown as Element,
});

describe('useOverlayArrowStyle', () => {
  it.each([
    { isEnabled: false, placement: 'top start' },
    { isEnabled: true, placement: 'top' },
  ])(
    'should not measure elements for $placement when isEnabled is $isEnabled',
    ({ isEnabled, placement }) => {
      const overlayRef = createRef();
      const targetRef = createRef();
      const arrowStyle: CSSProperties = { left: 32 };

      const { result } = renderHook(() =>
        useOverlayArrowStyle({
          isEnabled,
          placement,
          arrowStyle,
          overlayRef,
          targetRef,
          direction: 'ltr',
          arrowBoundaryOffset: 16,
        })
      );

      expect(overlayRef.current.getBoundingClientRect).not.toHaveBeenCalled();
      expect(targetRef.current.getBoundingClientRect).not.toHaveBeenCalled();
      expect(result.current).toBe(arrowStyle);
    }
  );

  it('should merge only the positional override with the latest React Aria style', async () => {
    const overlayRef = createRef();
    const targetRef = createRef();
    const initialArrowStyle: CSSProperties = { left: 32 };

    const { rerender, result } = renderHook(
      ({ arrowStyle }) =>
        useOverlayArrowStyle({
          arrowStyle,
          overlayRef,
          targetRef,
          isEnabled: true,
          direction: 'ltr',
          placement: 'top start',
          arrowBoundaryOffset: 16,
        }),
      { initialProps: { arrowStyle: initialArrowStyle } }
    );

    await waitFor(() => expect(result.current).toEqual({ left: 16 }));

    const nextArrowStyle: CSSProperties = {
      left: 40,
      position: 'absolute',
    };

    rerender({ arrowStyle: nextArrowStyle });

    expect(result.current).toEqual({
      left: 16,
      position: 'absolute',
    });
  });
});
