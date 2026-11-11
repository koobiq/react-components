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
  return value ?? fallback;
}

const ownedInputSlotKeys = [
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

const ownedCloseButtonSlotKeys = [
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

const ownedButtonSlotKeys = [
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
  return omitSlotProps(props, ownedInputSlotKeys);
}

export function omitSearchExpandableOwnedCloseButtonSlotProps(
  props: SearchExpandableCloseButtonSlotProps | undefined
): SearchExpandableCloseButtonSlotProps | undefined {
  return omitSlotProps(props, ownedCloseButtonSlotKeys);
}

export function omitSearchExpandableOwnedButtonSlotProps(
  props: SearchExpandableButtonSlotProps | undefined
): SearchExpandableButtonSlotProps | undefined {
  return omitSlotProps(props, ownedButtonSlotKeys);
}
