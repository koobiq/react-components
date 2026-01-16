'use client';

import { useRef, useEffect, forwardRef, useContext } from 'react';
import type { CSSProperties, ComponentRef } from 'react';

import { clsx, mergeProps, useDOMRef } from '@koobiq/react-core';
import { useContextProps } from '@koobiq/react-primitives';
import { Transition } from 'react-transition-group';
import type { TransitionProps } from 'react-transition-group/Transition';

import { AccordionStateContext } from '../../index';

import s from './AccordionDetails.module.css';
import type { AccordionDetailsRef, AccordionDetailsProps } from './index';
import { AccordionDetailsContext } from './index';

const TRANSITION_TIMEOUT = 300;

export const AccordionDetails = forwardRef<
  AccordionDetailsRef,
  AccordionDetailsProps
>((props, ref) => {
  const { children, className, style, slotProps, unmountOnExit, ...other } =
    props;

  const domRef = useDOMRef<ComponentRef<'div'>>(ref);
  const innerRef = useRef<HTMLParagraphElement>(null);

  const [panelProps] = useContextProps({}, domRef, AccordionDetailsContext);

  const { isExpanded } = useContext(AccordionStateContext);

  useEffect(() => {
    if (!isExpanded) domRef?.current?.setAttribute('hidden', 'until-found');
  }, []);

  const transitionProps: TransitionProps<HTMLElement> = mergeProps(
    {
      timeout: TRANSITION_TIMEOUT,
      onEnter: () => {
        domRef?.current?.removeAttribute('hidden');
      },
      onExited: () => {
        domRef?.current?.setAttribute('hidden', 'until-found');
      },
      in: isExpanded,
      nodeRef: domRef,
      unmountOnExit,
    },
    slotProps?.transition
  );

  return (
    <Transition {...transitionProps}>
      {(transition) => (
        <div
          ref={domRef}
          {...panelProps}
          data-transition={transition}
          className={clsx(s.base, className)}
          style={
            {
              '--accordion-details-block-size': `${innerRef.current?.clientHeight}px`,
              '--accordion-details-duration': `${TRANSITION_TIMEOUT}ms`,
              ...style,
            } as CSSProperties
          }
          {...other}
        >
          <p ref={innerRef}>{children}</p>
        </div>
      )}
    </Transition>
  );
});

AccordionDetails.displayName = 'AccordionDetails';
