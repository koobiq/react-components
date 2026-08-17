'use client';

import { forwardRef, type ReactNode } from 'react';

import { clsx, mergeProps } from '@koobiq/react-core';
import { IconChevronDown16, IconChevronUp16 } from '@koobiq/react-icons';
import {
  Button as ButtonPrimitive,
  composeRenderProps,
} from '@koobiq/react-primitives';

import s from './ClampedTextTrigger.module.css';
import type { ClampedTextTriggerProps } from './types';

type ClampedTextTriggerInternalProps = ClampedTextTriggerProps & {
  children: ReactNode;
  contentId: string;
  isExpanded: boolean;
  onToggle: () => void;
};

export const ClampedTextTrigger = forwardRef<
  HTMLButtonElement,
  ClampedTextTriggerInternalProps
>(function ClampedTextTrigger(
  {
    children,
    className,
    contentId,
    icon: iconProp,
    isExpanded,
    onToggle,
    ...props
  },
  ref
) {
  const buttonProps = mergeProps({ onPress: onToggle }, props);

  let icon: ReactNode;

  if (iconProp === undefined) {
    icon = isExpanded ? <IconChevronUp16 /> : <IconChevronDown16 />;
  } else if (typeof iconProp === 'function') {
    icon = iconProp(isExpanded);
  } else {
    icon = iconProp;
  }

  return (
    <ButtonPrimitive
      {...buttonProps}
      ref={ref}
      type="button"
      className={composeRenderProps(className, (value) => clsx(s.base, value))}
      aria-controls={contentId}
      aria-expanded={isExpanded}
    >
      {icon == null || icon === false ? null : (
        <span className={s.icon} aria-hidden>
          {icon}
        </span>
      )}
      <span>{children}</span>
    </ButtonPrimitive>
  );
});
