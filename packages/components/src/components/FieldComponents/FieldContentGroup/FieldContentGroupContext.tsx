import { createContext, useContext } from 'react';

export type FieldContentGroupContextProps = {
  isDisabled?: boolean;
  hasValue?: boolean;
  isHovered?: boolean;
  isFocusWithin?: boolean;
  isInvalid?: boolean;
};

export const FieldContentGroupContext =
  createContext<FieldContentGroupContextProps>({});

export const useFieldInputGroup = () => useContext(FieldContentGroupContext);
