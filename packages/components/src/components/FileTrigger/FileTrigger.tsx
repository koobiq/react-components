'use client';

import { forwardRef } from 'react';

import { FileTrigger as FileTriggerPrimitive } from '@koobiq/react-primitives';

import type { FileTriggerRef, FileTriggerProps } from './types';

/**
 * FileTrigger opens the system file dialog from any pressable component.
 * It renders no markup of its own, apart from a hidden file input.
 */
export const FileTrigger = forwardRef<FileTriggerRef, FileTriggerProps>(
  (props, ref) => {
    const { accept, ...other } = props;

    return (
      <FileTriggerPrimitive ref={ref} acceptedFileTypes={accept} {...other} />
    );
  }
);

FileTrigger.displayName = 'FileTrigger';
