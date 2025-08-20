import { createContext, useContext } from 'react';

export type FieldContentGroupContextProps = {
  isDisabled?: boolean;
  hasStartAddon?: boolean;
  hasEndAddon?: boolean;
  isHovered?: boolean;
  isFocusWithin?: boolean;
  isInvalid?: boolean;
};

export const FieldContentGroupContext =
  createContext<FieldContentGroupContextProps>({});

export const useFieldContentGroup = () => useContext(FieldContentGroupContext);
