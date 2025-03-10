'use client';

import { type ComponentRef, forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';

import { ModalTrigger } from '../ModalTrigger';

import s from './SidePanel.module.css';
import type { SidePanelProps } from './types';

export const SidePanel = forwardRef<ComponentRef<'div'>, SidePanelProps>(
  (props, ref) => {
    const {
      size = 'medium',
      position = 'left',
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
        data-position={position}
        slotProps={slopProps}
        hideCloseButton={hideCloseButton}
        className={clsx(s.base, s[size], s[position], className)}
        {...other}
        ref={ref}
      >
        {children}
      </ModalTrigger>
    );
  }
);

SidePanel.displayName = 'SidePanel';
