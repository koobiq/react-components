import { createContext, useContext } from 'react';

export type FieldInputGroupContextProps = {
  disabled?: boolean;
  hasValue?: boolean;
  hovered?: boolean;
  focusWithin?: boolean;
};

export const FieldInputGroupContext =
  createContext<FieldInputGroupContextProps>({});

export const useFieldInputGroup = () => useContext(FieldInputGroupContext);
