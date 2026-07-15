import { useEffect, useRef } from 'react';
import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react';

import { useBoolean } from '@koobiq/react-core';

const DRAG_THRESHOLD = 4;
const MIN_INERTIA_VELOCITY = 0.02;
const MAX_INERTIA_VELOCITY = 3;
const MAX_FRAME_DURATION = 32;
const FRICTION_PER_MILLISECOND = 0.003;

type DragState = {
  pointerId: number;
  startX: number;
  lastX: number;
  lastTimestamp: number;
  velocity: number;
  hasDragged: boolean;
};

/** Adds mouse drag-to-scroll and momentum without affecting native touch scrolling. */
export const useDragScroll = (isEnabled: boolean) => {
  const dragStateRef = useRef<DragState | null>(null);
  const inertiaFrameRef = useRef<number | null>(null);
  const clickResetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suppressClickRef = useRef(false);
  const [isDragging, { on: startDragging, off: stopDragging }] = useBoolean();

  const cancelInertia = () => {
    if (inertiaFrameRef.current !== null) {
      cancelAnimationFrame(inertiaFrameRef.current);
      inertiaFrameRef.current = null;
    }
  };

  const startInertia = (element: HTMLElement, initialVelocity: number) => {
    cancelInertia();

    if (Math.abs(initialVelocity) < MIN_INERTIA_VELOCITY) return;

    let velocity = initialVelocity;
    let previousTimestamp: number | null = null;

    const step = (timestamp: number) => {
      const frameDuration = Math.min(
        previousTimestamp === null ? 16 : timestamp - previousTimestamp,
        MAX_FRAME_DURATION
      );

      previousTimestamp = timestamp;

      const previousScrollLeft = element.scrollLeft;
      element.scrollLeft += velocity * frameDuration;

      const reachedBoundary = element.scrollLeft === previousScrollLeft;

      velocity *= Math.exp(-FRICTION_PER_MILLISECOND * frameDuration);

      if (reachedBoundary || Math.abs(velocity) < MIN_INERTIA_VELOCITY) {
        inertiaFrameRef.current = null;

        return;
      }

      inertiaFrameRef.current = requestAnimationFrame(step);
    };

    inertiaFrameRef.current = requestAnimationFrame(step);
  };

  const resetDrag = () => {
    dragStateRef.current = null;
    stopDragging();
  };

  const onPointerDownCapture = (event: ReactPointerEvent<HTMLElement>) => {
    cancelInertia();

    if (clickResetTimerRef.current !== null) {
      clearTimeout(clickResetTimerRef.current);
      clickResetTimerRef.current = null;
    }

    suppressClickRef.current = false;

    if (!isEnabled || event.pointerType !== 'mouse' || event.button !== 0) {
      return;
    }

    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      lastX: event.clientX,
      lastTimestamp: event.timeStamp,
      velocity: 0,
      hasDragged: false,
    };
  };

  const onPointerMoveCapture = (event: ReactPointerEvent<HTMLElement>) => {
    const dragState = dragStateRef.current;

    if (!dragState || event.pointerId !== dragState.pointerId) return;

    const totalDistance = event.clientX - dragState.startX;

    if (!dragState.hasDragged && Math.abs(totalDistance) < DRAG_THRESHOLD) {
      return;
    }

    if (!dragState.hasDragged) {
      dragState.hasDragged = true;
      suppressClickRef.current = true;
      startDragging();
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }

    event.preventDefault();

    const distance = event.clientX - dragState.lastX;
    const elapsed = Math.max(event.timeStamp - dragState.lastTimestamp, 1);

    const instantVelocity = Math.max(
      -MAX_INERTIA_VELOCITY,
      Math.min(MAX_INERTIA_VELOCITY, -distance / elapsed)
    );

    event.currentTarget.scrollLeft -= distance;

    dragState.velocity =
      dragState.velocity === 0
        ? instantVelocity
        : dragState.velocity * 0.7 + instantVelocity * 0.3;

    dragState.lastX = event.clientX;
    dragState.lastTimestamp = event.timeStamp;
  };

  const onPointerUpCapture = (event: ReactPointerEvent<HTMLElement>) => {
    const dragState = dragStateRef.current;

    if (!dragState || event.pointerId !== dragState.pointerId) return;

    if (dragState.hasDragged) {
      event.preventDefault();

      if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      const releaseDelay = event.timeStamp - dragState.lastTimestamp;

      const releaseVelocity =
        releaseDelay > 80
          ? 0
          : dragState.velocity *
            Math.exp(-FRICTION_PER_MILLISECOND * releaseDelay);

      startInertia(event.currentTarget, releaseVelocity);

      clickResetTimerRef.current = setTimeout(() => {
        suppressClickRef.current = false;
        clickResetTimerRef.current = null;
      });
    }

    resetDrag();
  };

  const onPointerCancelCapture = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragStateRef.current?.pointerId !== event.pointerId) return;

    suppressClickRef.current = false;
    resetDrag();
  };

  const onClickCapture = (event: ReactMouseEvent<HTMLElement>) => {
    if (!suppressClickRef.current) return;

    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  useEffect(() => {
    if (!isEnabled) {
      suppressClickRef.current = false;
      resetDrag();
    }

    return () => {
      cancelInertia();
      suppressClickRef.current = false;

      if (clickResetTimerRef.current !== null) {
        clearTimeout(clickResetTimerRef.current);
        clickResetTimerRef.current = null;
      }
    };
  }, [isEnabled]);

  return {
    isDragging,
    cancelInertia,
    dragScrollProps: {
      onClickCapture,
      onPointerDownCapture,
      onPointerMoveCapture,
      onPointerUpCapture,
      onPointerCancelCapture,
      onWheelCapture: cancelInertia,
    },
  };
};
