import { type ComponentRef, forwardRef } from 'react';

import { clsx, useLocalizedStringFormatter } from '@koobiq/react-core';
import { IconCircleXmark16 } from '@koobiq/react-icons';

import { IconButton, type IconButtonProps } from '../../IconButton';
import { useFormFieldControlGroup } from '../FormFieldControlGroup';

import s from './FormFieldClearButton.module.css';
import intlMessages from './intl.json';

export type FormFieldClearButtonProps = {
  isHidden?: boolean;
  isClearable?: boolean;
} & IconButtonProps;

export const FormFieldClearButton = forwardRef<
  ComponentRef<'button'>,
  FormFieldClearButtonProps
>(({ isHidden, isClearable, className, ...other }) => {
  const { isInvalid } = useFormFieldControlGroup();
  const t = useLocalizedStringFormatter(intlMessages);

  if (!isClearable) return null;

  return (
    <IconButton
      slot="clear"
      aria-hidden={isHidden}
      className={clsx(s.base, className)}
      variant={isInvalid ? 'error' : 'fade-contrast'}
      aria-label={t.format('clear')}
      preventFocusOnPress
      {...other}
    >
      <IconCircleXmark16 />
    </IconButton>
  );
});

FormFieldClearButton.displayName = 'FormFieldClearButton';
