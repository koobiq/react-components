import { createContext, useContext } from 'react';

export type FieldInputGroupContextProps = {
  isDisabled?: boolean;
  hasValue?: boolean;
  isHovered?: boolean;
  isFocusWithin?: boolean;
};

export const FieldInputGroupContext =
  createContext<FieldInputGroupContextProps>({});

export const useFieldInputGroup = () => useContext(FieldInputGroupContext);
