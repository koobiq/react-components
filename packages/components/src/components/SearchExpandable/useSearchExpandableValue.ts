'use client';

import { useCallback, useRef, useState } from 'react';

import {
  useControlledState,
  useDebounceCallback,
  useIsomorphicEffect,
  useMutableRef,
} from '@koobiq/react-core';

import {
  searchExpandableDefaultEmitValueTimeout,
  searchExpandableDefaultValue,
} from './types';
import { normalizeSearchExpandableValue } from './utils';

export type UseSearchExpandableValueOptions = {
  value?: string | null;
  defaultValue?: string;
  onChange?: (value: string) => void;
  emitValueTimeout?: number;
  isEmitValueByEnterEnabled?: boolean;
  onExternalValue?: (value: string) => void;
};

export type UseSearchExpandableValueResult = {
  draftValue: string;
  handleDraftChange: (value: string) => void;
  commitDraft: () => void;
  resetValue: () => void;
  cancelPendingEmit: () => void;
};

export function useSearchExpandableValue({
  value: valueProp,
  defaultValue = searchExpandableDefaultValue,
  onChange,
  emitValueTimeout = searchExpandableDefaultEmitValueTimeout,
  isEmitValueByEnterEnabled = false,
  onExternalValue,
}: UseSearchExpandableValueOptions): UseSearchExpandableValueResult {
  const normalizedValue = normalizeSearchExpandableValue(valueProp);
  const isControlled = normalizedValue !== undefined;

  const [modelValue, setModelValue] = useControlledState(
    normalizedValue,
    defaultValue
  );

  const [draftValue, setDraftValue] = useState(() => modelValue);

  const draftRef = useMutableRef(draftValue);
  const lastExchangedValueRef = useRef(modelValue);
  const previousControlledValueRef = useRef(normalizedValue);
  const isControlledRef = useMutableRef(isControlled);
  const onChangeRef = useMutableRef(onChange);
  const onExternalValueRef = useMutableRef(onExternalValue);

  const emitValue = useCallback(
    (nextValue: string) => {
      if (nextValue === lastExchangedValueRef.current) return;

      lastExchangedValueRef.current = nextValue;

      if (!isControlledRef.current) setModelValue(nextValue);

      onChangeRef.current?.(nextValue);
    },
    [setModelValue]
  );

  const [debouncedEmit, cancelPendingEmit] = useDebounceCallback({
    callback: emitValue,
    delay: emitValueTimeout,
  });

  const handleDraftChange = useCallback(
    (nextValue: string) => {
      draftRef.current = nextValue;
      setDraftValue(nextValue);

      if (isEmitValueByEnterEnabled) {
        cancelPendingEmit();

        return;
      }

      debouncedEmit(nextValue);
    },
    [cancelPendingEmit, debouncedEmit, draftRef, isEmitValueByEnterEnabled]
  );

  const commitDraft = useCallback(() => {
    cancelPendingEmit();
    emitValue(draftRef.current);
  }, [cancelPendingEmit, draftRef, emitValue]);

  const resetValue = useCallback(() => {
    cancelPendingEmit();

    draftRef.current = '';
    setDraftValue('');
    lastExchangedValueRef.current = '';

    if (!isControlledRef.current) setModelValue('');

    onChangeRef.current?.('');
  }, [cancelPendingEmit, draftRef, setModelValue]);

  useIsomorphicEffect(() => {
    if (isEmitValueByEnterEnabled) cancelPendingEmit();
  }, [cancelPendingEmit, isEmitValueByEnterEnabled]);

  useIsomorphicEffect(() => {
    if (normalizedValue === undefined) return;
    if (previousControlledValueRef.current === normalizedValue) return;

    previousControlledValueRef.current = normalizedValue;

    cancelPendingEmit();

    draftRef.current = normalizedValue;
    setDraftValue(normalizedValue);
    lastExchangedValueRef.current = normalizedValue;

    onExternalValueRef.current?.(normalizedValue);
  }, [normalizedValue, cancelPendingEmit, draftRef]);

  return {
    draftValue,
    handleDraftChange,
    commitDraft,
    resetValue,
    cancelPendingEmit,
  };
}
