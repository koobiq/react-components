'use client';

import { createContext, forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';
import type { ContextValue } from '@koobiq/react-primitives';
import { Button, useContextProps } from '@koobiq/react-primitives';
import type { DisclosureAria } from '@react-aria/disclosure';

import { Typography } from '../../../Typography';
import s from '../../Disclosure.module.css';

import type { DisclosureTriggerRef, DisclosureTriggerProps } from './index';

export const DisclosureTriggerContext =
  createContext<ContextValue<DisclosureAria['buttonProps'], HTMLButtonElement>>(
    null
  );

export const DisclosureTrigger = forwardRef<
  DisclosureTriggerRef,
  DisclosureTriggerProps
>((props, ref) => {
  const { className, children } = props;

  const [triggerProps, triggerRef] = useContextProps(
    { children },
    undefined,
    DisclosureTriggerContext
  );

  return (
    <Typography
      as="h3"
      ref={ref}
      variant="inherit"
      className={clsx(s.trigger, className)}
    >
      <Button {...triggerProps} ref={triggerRef} />
    </Typography>
  );
});

DisclosureTrigger.displayName = 'DisclosureTrigger';
