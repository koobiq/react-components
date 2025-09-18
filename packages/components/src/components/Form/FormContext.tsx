import { createContext, useContext } from 'react';

import type {
  FormControlPropLabelAlign,
  FormControlPropLabelPlacement,
} from '../FormControl';

export type FormContextProps = {
  labelPlacement?: FormControlPropLabelPlacement;
  labelAlign?: FormControlPropLabelAlign;
};

export const FormContext = createContext<FormContextProps>({});

export const useForm = () => useContext(FormContext);
