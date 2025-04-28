'use client';

import {
  type ComponentPropsWithRef,
  type ComponentRef,
  type CSSProperties,
  type ElementType,
} from 'react';

import { clsx, useDOMRef, polymorphicForwardRef } from '@koobiq/react-core';
import { Transition } from 'react-transition-group';

import s from './Backdrop.module.css';
import type { BackdropBaseProps } from './index';

// TODO: integrate usePress for handling press interactions
export const Backdrop = polymorphicForwardRef<'div', BackdropBaseProps>(
  (props, ref) => {
    const {
      as: Tag = 'div',
      duration = 300,
      open: openProp = false,
      style: styleProp,
      zIndex,
      children,
      className,
      ...other
    } = props;

    const domRef = useDOMRef<ComponentRef<'div'>>(ref);

    const style = {
      '--backdrop-z-index': zIndex,
      '--backdrop-duration': `${duration}ms`,
      ...styleProp,
    } as CSSProperties;

    return (
      <Transition
        in={openProp}
        nodeRef={domRef}
        timeout={duration}
        appear
        unmountOnExit
      >
        {(state) => (
          <Tag
            className={clsx(s.base, className)}
            data-transition={state}
            style={style}
            aria-hidden
            {...other}
            ref={domRef}
          >
            {children}
          </Tag>
        )}
      </Transition>
    );
  }
);

Backdrop.displayName = 'Backdrop';

export type BackdropProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof Backdrop<As>>;
