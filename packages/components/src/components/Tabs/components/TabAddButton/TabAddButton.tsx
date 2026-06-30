import { type ComponentRef, forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';
import { IconPlus16 } from '@koobiq/react-icons';
import {
  Button as ButtonPrimitive,
  type ButtonBaseProps,
} from '@koobiq/react-primitives';

import s from './TabAddButton.module.css';

type TabAddButtonOrientation = 'horizontal' | 'vertical';

export type TabAddButtonProps = Omit<ButtonBaseProps, 'className'> & {
  className?: string;
};

type TabAddButtonViewProps = TabAddButtonProps & {
  orientation?: TabAddButtonOrientation;
  isUnderlined?: boolean;
};

/**
 * The trailing add ("+") button for editable tabs. Built on the primitive
 * Button and styled with the tab surface states, so it matches tabs in every
 * state.
 */
export const TabAddButton = forwardRef<
  ComponentRef<'button'>,
  TabAddButtonViewProps
>(
  (
    { className, orientation = 'horizontal', isUnderlined = false, ...other },
    ref
  ) => (
    <ButtonPrimitive
      ref={ref}
      {...other}
      data-slot="add-button"
      data-orientation={orientation}
      data-underlined={isUnderlined || undefined}
      className={clsx(
        s.base,
        !isUnderlined && s.default,
        isUnderlined && s.underlined,
        orientation && s[orientation],
        className
      )}
    >
      <span className={s.content}>
        <IconPlus16 />
      </span>
    </ButtonPrimitive>
  )
);

TabAddButton.displayName = 'TabAddButton';
