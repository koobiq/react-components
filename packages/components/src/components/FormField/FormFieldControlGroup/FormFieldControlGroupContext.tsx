import { createContext, useContext } from 'react';

export type FormFieldControlGroupContextProps = {
  isDisabled?: boolean;
  isReadOnly?: boolean;
  hasStartAddon?: boolean;
  hasEndAddon?: boolean;
  isHovered?: boolean;
  isFocusWithin?: boolean;
  isInvalid?: boolean;
};

export const FormFieldControlGroupContext =
  createContext<FormFieldControlGroupContextProps>({});

export const useFormFieldControlGroup = () =>
  useContext(FormFieldControlGroupContext);
