'use client';

import { forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';
import {
  Button as ButtonPrimitive,
  composeRenderProps,
} from '@koobiq/react-primitives';

import s from './ClampedTextTrigger.module.css';
import type { ClampedTextTriggerProps } from './types';

export const ClampedTextTrigger = forwardRef<
  HTMLButtonElement,
  ClampedTextTriggerProps
>(({ children, className, icon, ...props }, ref) => (
  <ButtonPrimitive
    {...props}
    ref={ref}
    type="button"
    className={composeRenderProps(className, (value) => clsx(s.base, value))}
  >
    {icon == null || icon === false ? null : (
      <span className={s.icon} aria-hidden>
        {icon}
      </span>
    )}
    <span>{children}</span>
  </ButtonPrimitive>
));

ClampedTextTrigger.displayName = 'ClampedTextTrigger';
