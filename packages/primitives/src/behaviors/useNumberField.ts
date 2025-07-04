import type { RefObject } from 'react';

import { useLocale } from '@react-aria/i18n';
import type { AriaNumberFieldProps } from '@react-aria/numberfield';
import { useNumberField as useNumberFieldReactAria } from '@react-aria/numberfield';
import { useNumberFieldState } from '@react-stately/numberfield';

export type UseNumberFieldProps = AriaNumberFieldProps;

export function useNumberField(
  props: UseNumberFieldProps,
  ref: RefObject<HTMLInputElement | null>
) {
  const { locale } = useLocale();

  const state = useNumberFieldState({ ...props, locale });

  return useNumberFieldReactAria(props, state, ref);
}

export type UseNumberFieldReturn = ReturnType<typeof useNumberField>;
