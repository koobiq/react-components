'use client';

import { useCallback, useRef } from 'react';
import type { ChangeEvent, InputHTMLAttributes, RefObject } from 'react';

import { useFileUploadContext } from '../../FileUploadContext';

export interface UseFileInputParams {
  /** Id for the input. */
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
}

/** Props for the hidden native file input (includes the non-standard `webkitdirectory`). */
export type FileInputElementProps = InputHTMLAttributes<HTMLInputElement> & {
  webkitdirectory?: string;
};

export interface UseFileInputReturn {
  /** Props to spread onto a visually-hidden `<input type="file">`. */
  inputProps: FileInputElementProps;
  /** Ref to the underlying input element. */
  inputRef: RefObject<HTMLInputElement | null>;
  /** Clears the input value (so the same file can be re-selected). */
  reset: () => void;
}

/**
 * Resolves upload configuration (local props overridden by a non-nil
 * {@link FileUploadContext}) and returns props for a hidden file input. The
 * input value is reset after each selection so re-picking the same file
 * re-fires `change`.
 */
export function useFileInput(params: UseFileInputParams): UseFileInputReturn {
  const context = useFileUploadContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const { onChange } = params;

  const resolvedId = context?.id ?? params.id;
  const resolvedAccept = context?.accept ?? params.accept;
  const resolvedMultiple = context?.multiple ?? params.multiple;
  const resolvedDirectory = context?.directory ?? params.directory;
  const resolvedDisabled = context?.isDisabled ?? params.isDisabled;

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      // Reset so selecting the same file consecutively still fires `change`.
      event.target.value = '';
    },
    [onChange]
  );

  const reset = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  }, []);

  const inputProps: FileInputElementProps = {
    type: 'file',
    id: resolvedId ?? undefined,
    accept: resolvedAccept ?? undefined,
    multiple: resolvedMultiple ?? undefined,
    disabled: resolvedDisabled ?? undefined,
    onChange: handleChange,
    ...(resolvedDirectory ? { webkitdirectory: '' } : {}),
  };

  return { inputProps, inputRef, reset };
}
