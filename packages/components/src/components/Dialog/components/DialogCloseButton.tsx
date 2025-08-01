'use client';

import { forwardRef } from 'react';
import type { ComponentRef } from 'react';

import { useLocalizedStringFormatter } from '@koobiq/react-core';
import { IconXmark16 } from '@koobiq/react-icons';

import { Button, type ButtonProps } from '../../Button';
import s from '../Dialog.module.css';
import intlMessages from '../intl.json';

export type DialogCloseButtonRef = ComponentRef<'button'>;

export type DialogCloseButtonProps = ButtonProps;

export const DialogCloseButton = forwardRef<
  DialogCloseButtonRef,
  DialogCloseButtonProps
>((props, ref) => {
  const stringFormatter = useLocalizedStringFormatter(intlMessages);

  return (
    <div className={s.closeButton}>
      <Button
        aria-label={stringFormatter.format('close')}
        startIcon={<IconXmark16 />}
        variant="contrast-transparent"
        slot="close"
        onlyIcon
        {...props}
        ref={ref}
      />
    </div>
  );
});

DialogCloseButton.displayName = 'DialogCloseButton';
