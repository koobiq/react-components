'use client';

import { useForm } from '../Form';

import type { TagInputProps } from './types';

export function useTagInputResolvedProps<T extends object>(
  props: TagInputProps<T>
): TagInputProps<T> {
  const { isDisabled: formIsDisabled, isReadOnly: formIsReadOnly } = useForm();

  return {
    ...props,
    isDisabled: props.isDisabled ?? formIsDisabled,
    isReadOnly: props.isReadOnly ?? formIsReadOnly,
  };
}
