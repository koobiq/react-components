'use client';

import { forwardRef, useEffect } from 'react';

import {
  useDOMRef,
  mergeProps,
  clsx,
  useBoolean,
  useElementSize,
  useEventListener,
} from '@koobiq/react-core';
import { ButtonContext, Provider, useDialog } from '@koobiq/react-primitives';

import { utilClasses } from '../../styles/utility';

import {
  DialogBody,
  DialogFooter,
  DialogHeader,
  DialogCloseButton,
  DialogBodyContext,
} from './components';
import s from './Dialog.module.css';
import type { DialogProps, DialogRef } from './types';

const DialogComponent = forwardRef<DialogRef, DialogProps>(
  ({ onClose, children, slotProps, hideCloseButton, ...other }, ref) => {
    const [topOverflow, { set: setTopOverflow }] = useBoolean();
    const [bottomOverflow, { set: setBottomOverflow }] = useBoolean();
    const domRef = useDOMRef<DialogRef>(ref);

    const { dialogProps } = useDialog(other, domRef);

    const showCloseButton = !hideCloseButton;

    const rootProps = mergeProps(
      {
        className: clsx(s.base, utilClasses.typography['text-normal']),
        'data-close-button': showCloseButton || undefined,
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

    const { ref: bodyRef, height } = useElementSize();

    useEffect(() => {
      if (bodyRef.current) updateOverflow(bodyRef.current);
    }, [bodyRef.current, height]);

    useEventListener({
      element: bodyRef,
      eventName: 'scroll',
      handler: () => {
        updateOverflow(bodyRef.current);
      },
    });

    return (
      <Provider
        values={[
          [DialogBodyContext, { ref: bodyRef }],
          [
            ButtonContext,
            {
              slots: {
                close: {
                  onPress: onClose,
                },
              },
            },
          ],
        ]}
      >
        <section {...rootProps} ref={domRef}>
          {showCloseButton && (
            <DialogCloseButton {...slotProps?.['close-button']} />
          )}
          <div {...containerProps}>{children}</div>
        </section>
      </Provider>
    );
  }
);

DialogComponent.displayName = 'Dialog';

type CompoundedComponent = typeof DialogComponent & {
  Header: typeof DialogHeader;
  Body: typeof DialogBody;
  Footer: typeof DialogFooter;
};

export const Dialog = DialogComponent as CompoundedComponent;

Dialog.Header = DialogHeader;
Dialog.Body = DialogBody;
Dialog.Footer = DialogFooter;
