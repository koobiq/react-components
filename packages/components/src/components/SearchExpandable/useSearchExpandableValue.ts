'use client';

import { useCallback, useRef, useState } from 'react';

import {
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

  const initialValue = normalizedValue ?? defaultValue;

  const [draftValue, setDraftValue] = useState(() => initialValue);

  const draftRef = useMutableRef(draftValue);
  const lastExchangedValueRef = useRef(initialValue);
  const previousControlledValueRef = useRef(normalizedValue);
  const onChangeRef = useMutableRef(onChange);
  const onExternalValueRef = useMutableRef(onExternalValue);

  const emitValue = useCallback((nextValue: string) => {
    if (nextValue === lastExchangedValueRef.current) return;

    lastExchangedValueRef.current = nextValue;

    onChangeRef.current?.(nextValue);
  }, []);

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

    onChangeRef.current?.('');
  }, [cancelPendingEmit, draftRef]);

  useIsomorphicEffect(() => {
    if (isEmitValueByEnterEnabled) cancelPendingEmit();
  }, [cancelPendingEmit, isEmitValueByEnterEnabled]);

  useIsomorphicEffect(() => {
    if (normalizedValue === undefined) return;
    if (previousControlledValueRef.current === normalizedValue) return;

    previousControlledValueRef.current = normalizedValue;

    // A bound control commonly echoes a value right after this hook emitted
    // it (a transitioned store, a router query). The echo is not an external
    // write: it must not clobber keystrokes typed since the emission nor the
    // debounce still waiting to send them.
    if (normalizedValue === lastExchangedValueRef.current) return;

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
