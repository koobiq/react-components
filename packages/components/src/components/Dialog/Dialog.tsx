'use client';

import { forwardRef, useEffect, useRef } from 'react';

import {
  useDOMRef,
  mergeProps,
  clsx,
  useBoolean,
  useMultiRef,
  useElementSize,
  useEventListener,
} from '@koobiq/react-core';
import { useDialog } from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';

import { DialogCloseButton } from './components';
import s from './Dialog.module.css';
import { DialogContext } from './DialogContext';
import type { DialogProps, DialogRef } from './types';

export const Dialog = forwardRef<DialogRef, DialogProps>(
  (
    {
      children,
      onClose,
      hideCloseButton,
      startAddon,
      endAddon,
      slotProps,
      ...other
    },
    ref
  ) => {
    const [topOverflow, { set: setTopOverflow }] = useBoolean();
    const [bottomOverflow, { set: setBottomOverflow }] = useBoolean();
    const contentRef = useRef<HTMLDivElement | null>(null);
    const domRef = useDOMRef<DialogRef>(ref);

    const { dialogProps } = useDialog(other, domRef);

    const showCloseButton = !hideCloseButton;

    const rootProps = mergeProps(
      {
        className: clsx(s.base, utilClasses.typography['text-normal']),
        'data-close-button': showCloseButton,
        'data-top-overflow': topOverflow,
        'data-bottom-overflow': bottomOverflow,
      },
      other,
      dialogProps
    );

    const containerProps = mergeProps({
      className: s.container,
    });

    const updateOverflow = (element: HTMLElement | null) => {
      if (!element) return;

      setTopOverflow(element.scrollTop > 0);

      setBottomOverflow(
        element.scrollTop + element.clientHeight < element.scrollHeight
      );
    };

    const { ref: innerRef, height } = useElementSize();

    useEffect(() => {
      if (contentRef.current) updateOverflow(contentRef.current);
    }, [contentRef.current, height]);

    useEventListener({
      element: contentRef,
      eventName: 'scroll',
      handler: () => {
        updateOverflow(contentRef.current);
      },
    });

    return (
      <DialogContext.Provider
        value={{
          close: onClose,
          slots: { content: { ref: useMultiRef([contentRef, innerRef]) } },
        }}
      >
        <div {...rootProps} ref={domRef}>
          {showCloseButton && (
            <DialogCloseButton {...slotProps?.['close-button']} />
          )}
          {startAddon}
          <div {...containerProps}>{children}</div>
          {endAddon}
        </div>
      </DialogContext.Provider>
    );
  }
);

Dialog.displayName = 'Dialog';
