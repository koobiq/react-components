import { forwardRef, useContext, useState, useMemo } from 'react';

import { useDOMRef, useMove, mergeProps } from '@koobiq/react-core';
import { useContextProps } from '@koobiq/react-primitives';
import { createPortal } from 'react-dom';
import { Transition } from 'react-transition-group';

import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '../../../Dialog';
import { ContentPanelStateContext } from '../../ContentPanelStateContext';

import s from './ContentPanel.module.css';
import { ContentPanelContext } from './ContentPanelContext';
import type { ContentPanelProps, ContentPanelRef } from './types';

const clamp = (v: number, min: number, max: number) =>
  Math.max(min, Math.min(max, v));

const ContentPanelComponent = forwardRef<ContentPanelRef, ContentPanelProps>(
  (props, ref) => {
    const { defaultWidth = 320, minWidth = 200, maxWidth = 600 } = props;
    const [width, setWidth] = useState(defaultWidth);

    const { children } = props;
    const domRef = useDOMRef<HTMLDivElement>(ref);

    const { state, portalContainer } = useContext(ContentPanelStateContext);
    const { isOpen, close } = state;

    const [sidePanelProps, sidePanelRef] = useContextProps(
      {},
      domRef,
      ContentPanelContext
    );

    const { moveProps } = useMove({
      onMoveStart() {
        document.body.dataset.resizing = 'true';
      },
      onMoveEnd() {
        delete document.body.dataset.resizing;
      },
      onMove(e) {
        // левая панель: ширина += deltaX
        setWidth((w) => clamp(w - e.deltaX, minWidth, maxWidth));
      },
    });

    const separatorProps = useMemo(
      () => ({
        role: 'separator',
        'aria-orientation': 'vertical',
        'aria-label': 'Resize panel',
        'aria-valuemin': minWidth,
        'aria-valuemax': maxWidth,
        'aria-valuenow': Math.round(width),
        tabIndex: 0,
      }),
      [minWidth, maxWidth, width]
    );

    if (!portalContainer) return null;

    return createPortal(
      <Transition
        timeout={300}
        in={isOpen}
        nodeRef={sidePanelRef}
        unmountOnExit
        appear
      >
        {(transition) => (
          <Dialog
            onClose={close}
            className={s.base}
            data-transition={transition}
            ref={sidePanelRef}
            {...sidePanelProps}
            style={{
              width,
            }}
          >
            <div
              {...mergeProps(separatorProps, moveProps)}
              className={s.resizer}
            />
            {children}
          </Dialog>
        )}
      </Transition>,
      portalContainer
    );
  }
);

ContentPanelComponent.displayName = 'ContentPanel';

type CompoundedComponent = typeof ContentPanelComponent & {
  Header: typeof DialogHeader;
  Body: typeof DialogBody;
  Footer: typeof DialogFooter;
};

export const ContentPanel = ContentPanelComponent as CompoundedComponent;

ContentPanel.Header = DialogHeader;
ContentPanel.Body = DialogBody;
ContentPanel.Footer = DialogFooter;
