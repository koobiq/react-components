import { type ComponentRef, forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';
import { IconPlus16 } from '@koobiq/react-icons';
import {
  Button as ButtonPrimitive,
  type ButtonBaseProps,
} from '@koobiq/react-primitives';

import s from '../../Tabs.module.css';

export type TabAddButtonProps = Omit<ButtonBaseProps, 'className'> & {
  className?: string;
};

/**
 * The trailing add ("+") button for editable tabs. Built on the primitive
 * Button and styled with the shared tab surface, so it matches tabs in every
 * state (hover / focus / pressed / disabled).
 */
export const TabAddButton = forwardRef<
  ComponentRef<'button'>,
  TabAddButtonProps
>(({ className, ...other }, ref) => (
  <ButtonPrimitive
    ref={ref}
    data-slot="add-button"
    className={clsx(s.addButton, className)}
    {...other}
  >
    <span className={s.content}>
      <IconPlus16 />
    </span>
  </ButtonPrimitive>
));

TabAddButton.displayName = 'TabAddButton';
