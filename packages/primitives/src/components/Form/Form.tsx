import type { ForwardedRef } from 'react';
import { createContext, forwardRef } from 'react';

import type {
  GlobalDOMAttributes,
  FormProps as SharedFormProps,
} from '@koobiq/react-core';
import { FormValidationContext } from '@react-stately/form';

import type { ContextValue, DOMProps } from '../../utils';
import { useContextProps } from '../../utils';

export interface FormProps
  extends SharedFormProps,
    DOMProps,
    GlobalDOMAttributes<HTMLFormElement> {
  /**
   * Whether to use native HTML form validation to prevent form submission
   * when a field value is missing or invalid, or mark fields as required
   * or invalid via ARIA.
   * @default 'native'
   */
  validationBehavior?: 'aria' | 'native';
}

export const FormContext =
  createContext<ContextValue<FormProps, HTMLFormElement>>(null);

/**
 * A form is a group of inputs that allows users to submit data to a server,
 * with support for providing field validation errors.
 */
export const Form = forwardRef(function Form(
  props: FormProps,
  ref: ForwardedRef<HTMLFormElement>
) {
  // eslint-disable-next-line no-param-reassign
  [props, ref] = useContextProps(props, ref, FormContext);

  const {
    validationErrors,
    validationBehavior = 'native',
    children,
    className,
    ...domProps
  } = props;

  return (
    <form
      noValidate={validationBehavior !== 'native'}
      {...domProps}
      ref={ref}
      className={className}
    >
      <FormContext.Provider value={{ ...props, validationBehavior }}>
        <FormValidationContext.Provider value={validationErrors ?? {}}>
          {children}
        </FormValidationContext.Provider>
      </FormContext.Provider>
    </form>
  );
});
