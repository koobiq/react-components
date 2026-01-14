'use client';

import {
  createContext,
  type CSSProperties,
  forwardRef,
  useContext,
  useEffect,
  useRef,
} from 'react';

import { clsx, mergeProps } from '@koobiq/react-core';
import { type ContextValue, useContextProps } from '@koobiq/react-primitives';
import type { DisclosureAria } from '@react-aria/disclosure';
import { Transition, type TransitionStatus } from 'react-transition-group';
import type { TransitionProps } from 'react-transition-group/Transition';

import { DisclosureStateContext } from '../../Disclosure';
import s from '../../Disclosure.module.css';

import type { DisclosurePanelRef, DisclosurePanelProps } from './index';

const TIMEOUT = 3000;

export const DisclosurePanelContext =
  createContext<ContextValue<DisclosureAria['panelProps'], HTMLDivElement>>(
    null
  );

export const DisclosurePanel = forwardRef<
  DisclosurePanelRef,
  DisclosurePanelProps
>((props, ref) => {
  const { children, className, style, slotProps } = props;
  const innerRef = useRef<HTMLParagraphElement>(null);

  const [panelProps] = useContextProps({}, ref, DisclosurePanelContext);

  const panelRef = useRef<HTMLDivElement>(null);

  const { isExpanded } = useContext(DisclosureStateContext);

  useEffect(() => {
    if (!isExpanded) panelRef?.current?.setAttribute('hidden', 'until-found');
  }, []);

  const transitionProps: TransitionProps<HTMLElement> = mergeProps(
    {
      timeout: TIMEOUT,
      appear: true,
      onEnter: () => {
        panelRef?.current?.removeAttribute('hidden');
      },
      onExited: () => {
        panelRef?.current?.setAttribute('hidden', 'until-found');
      },
      in: isExpanded,
      nodeRef: panelRef,
    },
    slotProps?.transition
  );

  return (
    <Transition {...transitionProps}>
      {(state) => {
        const transitionStyles: Partial<
          Record<TransitionStatus, CSSProperties>
        > = {
          entering: {
            opacity: 1,
            height: innerRef.current?.clientHeight,
          },
          entered: {
            opacity: 1,
            height: isExpanded ? 'auto' : innerRef.current?.clientHeight,
          },
          exiting: {
            opacity: 0,
          },
          exited: {
            opacity: 0,
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
