'use client';

import { forwardRef } from 'react';
import type { ChangeEvent, ReactNode, Ref } from 'react';

import { clsx, mergeRefs } from '@koobiq/react-core';

import { utilClasses } from '../../../../styles/utility';
import s from '../../FileUpload.module.css';
import { useFileInput } from '../../hooks/useFileInput';

export interface FileInputProps {
  /** Id for the input (associates the browse label with it). */
  id?: string;
  /** Joined `accept` specifiers. */
  accept?: string;
  /** Whether multiple selection is allowed. */
  multiple?: boolean;
  /** Whether the input selects directories. */
  directory?: boolean;
  /** Whether the input is disabled. */
  isDisabled?: boolean;
  /** Change handler receiving the underlying DOM change event. */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Visible browse-link content. */
  children?: ReactNode;
  /** Additional CSS-classes for the label. */
  className?: string;
  /** External ref to the underlying input (e.g. for focus management). */
  inputRef?: Ref<HTMLInputElement>;
}

/**
 * A pseudo-link `<label>` wrapping a visually-hidden, tab-reachable native file
 * input. Activating the label opens the file dialog; the input drives keyboard
 * and assistive-technology interaction.
 */
export const FileInput = forwardRef<HTMLLabelElement, FileInputProps>(
  (props, ref) => {
    const {
      id,
      accept,
      multiple,
      directory,
      isDisabled,
      onChange,
      children,
      className,
      inputRef: externalInputRef,
    } = props;

    const { inputProps, inputRef } = useFileInput({
      id,
      accept,
      multiple,
      directory,
      isDisabled,
      onChange,
    });

    return (
      <label
        ref={ref}
        className={clsx(
          s.browseLink,
          isDisabled && s.browseLinkDisabled,
          className
        )}
        data-disabled={isDisabled || undefined}
      >
        {children}
        <input
          {...inputProps}
          ref={mergeRefs(inputRef, externalInputRef)}
          tabIndex={0}
          className={utilClasses.hideVisually}
        />
      </label>
    );
  }
);

FileInput.displayName = 'FileInput';
