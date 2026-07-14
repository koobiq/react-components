'use client';

import type { ComponentPropsWithRef } from 'react';
import { forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';

import { utilClasses } from '../../../../styles/utility';

import s from './Control.module.css';

const textNormal = utilClasses.typography['text-normal'];

export const FileUploadControl = forwardRef<
  HTMLDivElement,
  ComponentPropsWithRef<'div'>
>(({ children, className, ...other }, ref) => (
  <div
    {...other}
    ref={ref}
    data-slot="file-upload-control"
    className={clsx(s.base, textNormal, className)}
  >
    {children}
  </div>
));

FileUploadControl.displayName = 'FileUploadControl';
