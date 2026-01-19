import { forwardRef, useContext } from 'react';

import { useDOMRef } from '@koobiq/react-core';
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

const ContentPanelComponent = forwardRef<ContentPanelRef, ContentPanelProps>(
  (props, ref) => {
    const { children } = props;
    const domRef = useDOMRef<HTMLDivElement>(ref);

    const { state, portalContainer } = useContext(ContentPanelStateContext);
    const { isOpen, close } = state;

    const [sidePanelProps, sidePanelRef] = useContextProps(
      {},
      domRef,
      ContentPanelContext
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
          >
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
