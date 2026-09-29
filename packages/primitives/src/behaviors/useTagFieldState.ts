import { useCallback, useMemo } from 'react';

import type { Key } from '@koobiq/react-core';
import { useControlledState } from '@koobiq/react-core';

import { getClearKeys } from './clearPredicate';
import type {
  TagFieldAddContext,
  TagFieldAddSource,
  TagFieldState,
  TagFieldStateProps,
} from './useTagField';
import { useTagListState } from './useTagListState';

const DEFAULT_SPLIT_PATTERN = /,/;

const splitInputValue = (raw: string, splitPattern: RegExp): string[] =>
  raw
    .split(splitPattern)
    .map((value) => value.trim())
    .filter(Boolean);

const testSplitPattern = (splitPattern: RegExp, value: string): boolean => {
  splitPattern.lastIndex = 0;

  return splitPattern.test(value);
};

export function useTagFieldState<T extends object>(
  props: TagFieldStateProps<T>
): TagFieldState<T> {
  const {
    items,
    children,
    disabledKeys,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    inputValue: inputValueProp,
    defaultInputValue: defaultInputValueProp,
    onInputChange,
    splitPattern = DEFAULT_SPLIT_PATTERN,
    onAdd,
    onRemove,
    onClear,
    clearPredicate,
    isDisabled,
    isReadOnly,
  } = props;

  const tagListState = useTagListState<T>({
    items,
    children,
    disabledKeys,
    selectedKeys,
    defaultSelectedKeys,
    onSelectionChange,
    selectionMode: isReadOnly ? 'none' : 'multiple',
  });

  const [inputValue, setInputValue] = useControlledState<string>(
    inputValueProp,
    defaultInputValueProp ?? '',
    onInputChange
  );

  const defaultInputValue = defaultInputValueProp ?? '';
  const allowsAdding = Boolean(onAdd && !isDisabled && !isReadOnly);

  const addValues = useCallback(
    (values: string[], context: TagFieldAddContext<T>) => {
      if (!allowsAdding || values.length === 0) return false;

      onAdd?.(values, context);
      setInputValue('');

      return true;
    },
    [allowsAdding, onAdd, setInputValue]
  );

  const addFromInput = useCallback(
    (
      source: Exclude<TagFieldAddSource, 'suggestion'>,
      rawValue = inputValue
    ) => {
      const candidates = splitInputValue(rawValue, splitPattern);

      return addValues(candidates, { source });
    },
    [addValues, inputValue, splitPattern]
  );

  const isSeparator = useCallback(
    (value: string) => testSplitPattern(splitPattern, value),
    [splitPattern]
  );

  const remove = useCallback(
    (keys: Set<Key>) => {
      if (isDisabled || isReadOnly || !onRemove) return false;

      onRemove(keys);

      return true;
    },
    [isDisabled, isReadOnly, onRemove]
  );

  const clearKeys = useMemo(
    () =>
      getClearKeys(
        tagListState.collection.getKeys(),
        {
          collection: tagListState.collection,
          disabledKeys: tagListState.disabledKeys,
        },
        clearPredicate
      ),
    [tagListState.collection, tagListState.disabledKeys, clearPredicate]
  );

  const canClear = clearKeys.size > 0 || inputValue !== '';

  const clear = useCallback(() => {
    if (isDisabled || isReadOnly) return false;

    if (clearKeys.size > 0) onRemove?.(clearKeys);

    setInputValue('');
    onClear?.();

    return true;
  }, [clearKeys, isDisabled, isReadOnly, onClear, onRemove, setInputValue]);

  return {
    ...tagListState,
    inputValue,
    defaultInputValue,
    setInputValue,
    allowsAdding,
    isDisabled,
    isReadOnly,
    addValues,
    addFromInput,
    isSeparator,
    remove,
    canClear,
    clear,
  };
}
