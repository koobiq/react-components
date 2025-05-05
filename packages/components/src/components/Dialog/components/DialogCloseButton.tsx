'use client';

import { forwardRef } from 'react';
import type { ComponentRef } from 'react';

import { mergeProps } from '@koobiq/react-core';
import { IconXmark16 } from '@koobiq/react-icons';
import { useLocalizedStringFormatter } from '@koobiq/react-primitives';

import { Button, type ButtonProps } from '../../Button';
import s from '../Dialog.module.css';
import { useDialogProvider } from '../DialogContext';
import intlMessages from '../intl.json';

export type DialogCloseButtonRef = ComponentRef<'button'>;

export type DialogCloseButtonProps = ButtonProps;

export const DialogCloseButton = forwardRef<
  DialogCloseButtonRef,
  DialogCloseButtonProps
>(({ onPress, ...other }, ref) => {
  const { close } = useDialogProvider();
  const stringFormatter = useLocalizedStringFormatter(intlMessages);

  return (
    <div className={s.closeButton}>
      <Button
        {...mergeProps({ onPress: close }, { onPress })}
        aria-label={stringFormatter.format('close')}
        startIcon={<IconXmark16 />}
        variant="contrast-transparent"
        onlyIcon
        {...other}
        ref={ref}
      />
    </div>
  );
});

DialogCloseButton.displayName = 'DialogCloseButton';
