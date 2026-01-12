'use client';

import {
  createContext,
  type CSSProperties,
  forwardRef,
  useContext,
  useRef,
} from 'react';

import { clsx } from '@koobiq/react-core';
import { type ContextValue, useContextProps } from '@koobiq/react-primitives';
import type { DisclosureAria } from '@react-aria/disclosure';
import { Transition, type TransitionStatus } from 'react-transition-group';

import { DisclosureStateContext } from '../../Disclosure';
import s from '../../Disclosure.module.css';

import type { DisclosurePanelRef, DisclosurePanelProps } from './index';

const TIMEOUT = 300;

export const DisclosurePanelContext =
  createContext<ContextValue<DisclosureAria['panelProps'], HTMLDivElement>>(
    null
  );

export const DisclosurePanel = forwardRef<
  DisclosurePanelRef,
  DisclosurePanelProps
>((props, ref) => {
  const { children, className, style } = props;
  const innerRef = useRef<HTMLParagraphElement>(null);

  const [panelProps, panelRef] = useContextProps(
    {},
    ref,
    DisclosurePanelContext
  );

  const { isExpanded } = useContext(DisclosureStateContext);

  return (
    <Transition
      timeout={TIMEOUT}
      in={isExpanded}
      nodeRef={panelRef}
      unmountOnExit
    >
      {(state) => {
        const transitionStyles: Partial<
          Record<TransitionStatus, CSSProperties>
        > = {
          entering: {
            height: innerRef.current?.clientHeight,
          },
          entered: {
            height: isExpanded ? 'auto' : innerRef.current?.clientHeight,
          },
          exited: {
            visibility: 'hidden',
          },
        };

        return (
          <div
            className={clsx(s.panel, className)}
            ref={panelRef}
            {...panelProps}
            style={
              {
                height: 0,
                '--disclosure-panel-duration': `${TIMEOUT}ms`,
                ...transitionStyles[state],
                ...style,
              } as CSSProperties
            }
          >
            <p ref={innerRef}>{children}</p>
          </div>
        );
      }}
    </Transition>
  );
});

DisclosurePanel.displayName = 'DisclosurePanel';
