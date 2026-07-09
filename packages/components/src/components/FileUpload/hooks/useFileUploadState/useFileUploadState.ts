'use client';

import { useCallback, useMemo, useState } from 'react';

import { showErrorOnTouched } from '../../errorPredicates';
import type { FileUploadState, ShouldShowError } from '../../types';

export interface UseFileUploadStateParams {
  /** Whether the control is invalid. */
  isInvalid?: boolean;
  /** Whether the surrounding form has been submitted (fed by a form adapter). */
  isSubmitted?: boolean;
  /** Predicate deciding error visibility. @default showErrorOnTouched */
  shouldShowError?: ShouldShowError;
}

export interface UseFileUploadStateReturn {
  /** The current interaction state. */
  state: FileUploadState;
  /** Whether the error styling should be shown. */
  errorState: boolean;
  /** Whether the control has been touched. */
  isTouched: boolean;
  /** Whether the value has changed since mount. */
  isDirty: boolean;
  /** Marks the control as touched. */
  markTouched: () => void;
  /** Marks the control as dirty. */
  markDirty: () => void;
}

/**
 * Tracks touched/dirty interaction state and computes the error state via a
 * predicate. The React equivalent of the Angular `updateErrorState` machinery,
 * but pull-based (recomputed each render) rather than a `Subject`.
 */
export function useFileUploadState(
  params: UseFileUploadStateParams
): UseFileUploadStateReturn {
  const {
    isInvalid = false,
    isSubmitted = false,
    shouldShowError = showErrorOnTouched,
  } = params;

  const [isTouched, setTouched] = useState(false);
  const [isDirty, setDirty] = useState(false);

  const markTouched = useCallback(() => setTouched(true), []);
  const markDirty = useCallback(() => setDirty(true), []);

  const state = useMemo<FileUploadState>(
    () => ({ isInvalid, isTouched, isDirty, isSubmitted }),
    [isInvalid, isTouched, isDirty, isSubmitted]
  );

  const errorState = shouldShowError(state);

  return { state, errorState, isTouched, isDirty, markTouched, markDirty };
}
