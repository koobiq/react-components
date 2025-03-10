'use client';

import { type ComponentRef, forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';

import { ModalTrigger } from '../ModalTrigger';

import s from './Modal.module.css';
import type { ModalProps } from './types';

export const Modal = forwardRef<ComponentRef<'div'>, ModalProps>(
  (props, ref) => {
    const {
      size = 'medium',
      hideCloseButton = false,
      slotProps: slotPropsProp,
      children,
      className,
      ...other
    } = props;

    const slopProps = {
      ...slotPropsProp,
      dialog: {
        ...slotPropsProp?.dialog,
        className: clsx(s.dialog, slotPropsProp?.dialog?.className),
      },
    };

    return (
      <ModalTrigger
        data-size={size}
        slotProps={slopProps}
        hideCloseButton={hideCloseButton}
        className={clsx(s.base, s[size], className)}
        {...other}
        ref={ref}
      >
        {children}
      </ModalTrigger>
    );
  }
);

Modal.displayName = 'Modal';
