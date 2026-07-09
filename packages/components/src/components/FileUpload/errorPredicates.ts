import type { ShouldShowError } from './types';

/**
 * Default predicate: show the error when the control is invalid and has been
 * touched or the form was submitted.
 */
export const showErrorOnTouched: ShouldShowError = (s) =>
  s.isInvalid && (s.isTouched || s.isSubmitted);

/** Show the error only after the surrounding form has been submitted. */
export const showErrorOnSubmit: ShouldShowError = (s) =>
  s.isInvalid && s.isSubmitted;

/**
 * Defer error display until form submission — intended for required-style
 * errors that should not appear on touch alone.
 */
export const showErrorRequiredOnSubmit: ShouldShowError = (s) =>
  s.isInvalid && s.isSubmitted;

/** Show the error when the control is invalid and dirty (or the form was submitted). */
export const showErrorOnDirty: ShouldShowError = (s) =>
  s.isInvalid && (s.isDirty || s.isSubmitted);
