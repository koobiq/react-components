'use client';

import { useCallback, useLayoutEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { Overlay } from '@koobiq/react-primitives';

import s from './DropTargetOverlay.module.css';

type FileUploadDropTargetOverlayProps = {
  children: ReactNode;
  target: HTMLElement;
  isFullscreen?: boolean;
};

const getTargetStyle = (target: HTMLElement): CSSProperties => {
  const targetWindow = target.ownerDocument.defaultView;

  if (
    targetWindow &&
    (target === target.ownerDocument.documentElement ||
      target === target.ownerDocument.body)
  ) {
    return {
      top: 0,
      left: 0,
      width: targetWindow.innerWidth,
      height: targetWindow.innerHeight,
    };
  }

  const { top, left, width, height } = target.getBoundingClientRect();

  return { top, left, width, height };
};

export const FileUploadDropTargetOverlay = ({
  children,
  target,
  isFullscreen,
}: FileUploadDropTargetOverlayProps) => {
  const [style, setStyle] = useState<CSSProperties>(() =>
    getTargetStyle(target)
  );

  const updatePosition = useCallback(() => {
    setStyle(getTargetStyle(target));
  }, [target]);

  useLayoutEffect(() => {
    updatePosition();

    const targetWindow = target.ownerDocument.defaultView;

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? undefined
        : new ResizeObserver(updatePosition);

    resizeObserver?.observe(target);
    targetWindow?.addEventListener('resize', updatePosition);
    targetWindow?.addEventListener('scroll', updatePosition, true);

    return () => {
      resizeObserver?.disconnect();
      targetWindow?.removeEventListener('resize', updatePosition);
      targetWindow?.removeEventListener('scroll', updatePosition, true);
    };
  }, [target, updatePosition]);

  return (
    <Overlay disableFocusManagement>
      <div
        style={style}
        className={s.overlay}
        data-slot="overlay"
        data-fullscreen={isFullscreen || undefined}
      >
        {children}
      </div>
    </Overlay>
  );
};
