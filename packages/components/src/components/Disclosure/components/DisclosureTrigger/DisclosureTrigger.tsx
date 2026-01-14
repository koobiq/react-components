'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';
import { Button, useContextProps } from '@koobiq/react-primitives';

import { utilClasses } from '../../../../styles/utility';

import s from './DisclosureTrigger.module.css';
import type { DisclosureBaseTriggerProps } from './index';
import { DisclosureTriggerContext } from './index';

const typography = utilClasses.typography.inherit;

export const DisclosureTrigger = polymorphicForwardRef<
  'h3',
  DisclosureBaseTriggerProps
>((props, ref) => {
  const { className, children, as: Tag = 'h3', ...other } = props;

  const [triggerProps, triggerRef] = useContextProps(
    { children },
    undefined,
    DisclosureTriggerContext
  );

  return (
    <Tag className={clsx(s.base, typography, className)} {...other} ref={ref}>
      <Button {...triggerProps} ref={triggerRef} />
    </Tag>
  );
});

DisclosureTrigger.displayName = 'DisclosureTrigger';

export type DisclosureTriggerProps<As extends ElementType = 'h3'> =
  ComponentPropsWithRef<typeof DisclosureTrigger<As>>;
