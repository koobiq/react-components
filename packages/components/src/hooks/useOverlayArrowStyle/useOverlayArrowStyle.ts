import type { CSSProperties } from 'react';
import { useLayoutEffect, useState } from 'react';

type Direction = 'ltr' | 'rtl';

type Rect = Pick<DOMRect, 'bottom' | 'left' | 'right' | 'top'>;

type GetOverlayArrowStyleOptions = {
  arrowBoundaryOffset: number;
  direction: Direction;
  overlayRect?: Rect;
  placement: string;
  targetRect?: Rect;
};

type CrossAxisEdge = 'bottom' | 'left' | 'right' | 'top';

const getCrossAxisEdge = (
  placement: string,
  direction: Direction
): CrossAxisEdge | undefined => {
  const [side, alignment] = placement.split(' ');

  if (
    (side === 'top' || side === 'bottom') &&
    (alignment === 'start' || alignment === 'end')
  ) {
    const isStart = alignment === 'start';
    const isLeft = direction === 'ltr' ? isStart : !isStart;

    return isLeft ? 'left' : 'right';
  }

  if (
    (side === 'start' || side === 'end') &&
    (alignment === 'top' || alignment === 'bottom')
  ) {
    return alignment;
  }

  return undefined;
};

const isArrowPointingAtTarget = (
  edge: CrossAxisEdge,
  arrowBoundaryOffset: number,
  overlayRect: Rect,
  targetRect: Rect
) => {
  const isHorizontal = edge === 'left' || edge === 'right';

  const arrowCenter = isHorizontal
    ? edge === 'left'
      ? overlayRect.left + arrowBoundaryOffset
      : overlayRect.right - arrowBoundaryOffset
    : edge === 'top'
      ? overlayRect.top + arrowBoundaryOffset
      : overlayRect.bottom - arrowBoundaryOffset;

  const overlayStart = isHorizontal ? overlayRect.left : overlayRect.top;
  const overlayEnd = isHorizontal ? overlayRect.right : overlayRect.bottom;
  const targetStart = isHorizontal ? targetRect.left : targetRect.top;
  const targetEnd = isHorizontal ? targetRect.right : targetRect.bottom;

  return (
    arrowCenter >= overlayStart &&
    arrowCenter <= overlayEnd &&
    arrowCenter >= targetStart &&
    arrowCenter <= targetEnd
  );
};

const hasOverlayArrowAlignment = (placement: string) =>
  getCrossAxisEdge(placement, 'ltr') !== undefined;

export const getOverlayArrowStyle = ({
  arrowBoundaryOffset,
  direction,
  overlayRect,
  placement,
  targetRect,
}: GetOverlayArrowStyleOptions): CSSProperties | undefined => {
  const edge = getCrossAxisEdge(placement, direction);

  if (
    !edge ||
    !overlayRect ||
    !targetRect ||
    !isArrowPointingAtTarget(edge, arrowBoundaryOffset, overlayRect, targetRect)
  ) {
    return undefined;
  }

  if (edge === 'left' || edge === 'right') {
    return {
      left:
        edge === 'left'
          ? arrowBoundaryOffset
          : `calc(100% - ${arrowBoundaryOffset}px)`,
    };
  }

  return {
    top:
      edge === 'top'
        ? arrowBoundaryOffset
        : `calc(100% - ${arrowBoundaryOffset}px)`,
  };
};

type ElementRef = {
  readonly current: Element | null;
};

type UseOverlayArrowStyleOptions = {
  arrowBoundaryOffset: number;
  arrowStyle?: CSSProperties;
  direction: Direction;
  isEnabled: boolean;
  overlayRef: ElementRef;
  placement: string;
  targetRef: ElementRef;
};

const isSameArrowOverride = (current?: CSSProperties, next?: CSSProperties) =>
  current?.left === next?.left && current?.top === next?.top;

export const useOverlayArrowStyle = ({
  arrowBoundaryOffset,
  arrowStyle,
  direction,
  isEnabled,
  overlayRef,
  placement,
  targetRef,
}: UseOverlayArrowStyleOptions): CSSProperties | undefined => {
  const [overrideStyle, setOverrideStyle] = useState<CSSProperties>();

  useLayoutEffect(() => {
    if (!isEnabled || !hasOverlayArrowAlignment(placement)) {
      setOverrideStyle((currentStyle) =>
        currentStyle === undefined ? currentStyle : undefined
      );

      return;
    }

    const nextOverride = getOverlayArrowStyle({
      direction,
      placement,
      arrowBoundaryOffset,
      overlayRect: overlayRef.current?.getBoundingClientRect(),
      targetRect: targetRef.current?.getBoundingClientRect(),
    });

    setOverrideStyle((currentStyle) =>
      isSameArrowOverride(currentStyle, nextOverride)
        ? currentStyle
        : nextOverride
    );
  });

  return overrideStyle ? { ...arrowStyle, ...overrideStyle } : arrowStyle;
};
