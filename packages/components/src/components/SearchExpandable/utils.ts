import type {
  SearchExpandableButtonSlotProps,
  SearchExpandableCloseButtonSlotProps,
  SearchExpandableInputSlotProps,
} from './types';

export function normalizeSearchExpandableValue(
  value: string | null | undefined
): string | undefined {
  return value === undefined ? undefined : (value ?? '');
}

export function resolveSearchExpandableText(
  value: string | null | undefined,
  fallback: string
): string {
  return value || fallback;
}

/**
 * Keys owned by the component in each slot. The slot prop types in `types.ts`
 * are derived from these tuples, so the runtime omission and the public types
 * cannot drift apart.
 */
export const searchExpandableOwnedInputSlotKeys = [
  'aria-disabled',
  'aria-label',
  'aria-labelledby',
  'aria-readonly',
  'as',
  'autoComplete',
  'defaultValue',
  'disabled',
  'hidden',
  'onChange',
  'readOnly',
  'tabIndex',
  'type',
  'value',
] as const;

export const searchExpandableOwnedCloseButtonSlotKeys = [
  'aria-disabled',
  'aria-hidden',
  'disabled',
  'excludeFromTabOrder',
  'hidden',
  'isClearable',
  'isDisabled',
  'isHidden',
  'tabIndex',
] as const;

export const searchExpandableOwnedButtonSlotKeys = [
  'aria-disabled',
  'disabled',
  'hidden',
  'isDisabled',
] as const;

function omitSlotProps<T extends object>(
  props: T | undefined,
  keys: readonly string[]
): T | undefined {
  if (!props) return undefined;

  const result = { ...props } as Record<string, unknown>;

  keys.forEach((key) => {
    delete result[key];
  });

  return result as T;
}

export function omitSearchExpandableOwnedInputSlotProps(
  props: SearchExpandableInputSlotProps | undefined
): SearchExpandableInputSlotProps | undefined {
  return omitSlotProps(props, searchExpandableOwnedInputSlotKeys);
}

export function omitSearchExpandableOwnedCloseButtonSlotProps(
  props: SearchExpandableCloseButtonSlotProps | undefined
): SearchExpandableCloseButtonSlotProps | undefined {
  return omitSlotProps(props, searchExpandableOwnedCloseButtonSlotKeys);
}

export function omitSearchExpandableOwnedButtonSlotProps(
  props: SearchExpandableButtonSlotProps | undefined
): SearchExpandableButtonSlotProps | undefined {
  return omitSlotProps(props, searchExpandableOwnedButtonSlotKeys);
}
