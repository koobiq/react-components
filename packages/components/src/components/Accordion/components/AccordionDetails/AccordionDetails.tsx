'use client';

import { useRef, useEffect, forwardRef, useContext } from 'react';
import type { CSSProperties, ComponentRef } from 'react';

import { clsx, mergeProps, useDOMRef } from '@koobiq/react-core';
import { useContextProps } from '@koobiq/react-primitives';
import { Transition, type TransitionStatus } from 'react-transition-group';
import type { TransitionProps } from 'react-transition-group/Transition';

import { AccordionStateContext } from '../../index';

import s from './AccordionDetails.module.css';
import type { AccordionDetailsRef, AccordionDetailsProps } from './index';
import { AccordionDetailsContext } from './index';

const TIMEOUT = 300;

export const AccordionDetails = forwardRef<
  AccordionDetailsRef,
  AccordionDetailsProps
>((props, ref) => {
  const { children, className, style, slotProps, ...other } = props;

  const domRef = useDOMRef<ComponentRef<'div'>>(ref);
  const innerRef = useRef<HTMLParagraphElement>(null);

  const [panelProps] = useContextProps({}, domRef, AccordionDetailsContext);

  const { isExpanded } = useContext(AccordionStateContext);

  useEffect(() => {
    if (!isExpanded) domRef?.current?.setAttribute('hidden', 'until-found');
  }, []);

  const transitionProps: TransitionProps<HTMLElement> = mergeProps(
    {
      timeout: TIMEOUT,
      appear: true,
      onEnter: () => {
        domRef?.current?.removeAttribute('hidden');
      },
      onExited: () => {
        domRef?.current?.setAttribute('hidden', 'until-found');
      },
      in: isExpanded,
      nodeRef: domRef,
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
            className={clsx(s.base, className)}
            ref={domRef}
            {...panelProps}
            style={
              {
                height: 0,
                '--accordion-details-duration': `${TIMEOUT}ms`,
                ...transitionStyles[state],
                ...style,
              } as CSSProperties
            }
            {...other}
          >
            <p ref={innerRef}>{children}</p>
          </div>
        );
      }}
    </Transition>
  );
});

AccordionDetails.displayName = 'AccordionDetails';
