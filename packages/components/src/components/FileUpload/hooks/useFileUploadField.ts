import { useMemo } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';

import type { ValidationResult } from '@koobiq/react-core';
import { useField } from '@koobiq/react-primitives';

type FileUploadFieldDOMProps = Pick<
  ComponentPropsWithRef<'div'>,
  | 'id'
  | 'role'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-describedby'
  | 'aria-details'
  | 'aria-errormessage'
>;

type UseFileUploadFieldOptions = FileUploadFieldDOMProps & {
  label?: ReactNode;
  caption?: ReactNode;
  hasErrorMessage: boolean;
  isDisabled: boolean;
  isInvalid: boolean;
};

const getValidationResult = (isInvalid: boolean): ValidationResult => ({
  isInvalid,
  validationErrors: [],
  validationDetails: {
    badInput: false,
    customError: isInvalid,
    patternMismatch: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valueMissing: false,
    valid: !isInvalid,
  },
});

export const useFileUploadField = ({
  id,
  role,
  label,
  caption,
  hasErrorMessage,
  isDisabled,
  isInvalid,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
  'aria-details': ariaDetails,
  'aria-errormessage': ariaErrorMessage,
}: UseFileUploadFieldOptions) => {
  const { labelProps, fieldProps, descriptionProps, errorMessageProps } =
    useField({
      id,
      label,
      description: caption,
      isInvalid,
      labelElementType: 'span',
      errorMessage: isInvalid && hasErrorMessage,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
    });

  const validation = useMemo(() => getValidationResult(isInvalid), [isInvalid]);

  return {
    validation,
    labelProps,
    descriptionProps,
    errorMessageProps,
    controlProps: {
      ...fieldProps,
      role: role ?? 'group',
      'aria-details': ariaDetails,
      'aria-errormessage': ariaErrorMessage,
      'aria-disabled': isDisabled || undefined,
      'aria-invalid': isInvalid || undefined,
    } satisfies ComponentPropsWithRef<'div'>,
  };
};
