import { createContext, useContext } from 'react';

import type {
  FormFieldPropLabelAlign,
  FormFieldPropLabelPlacement,
} from '../FormField';

export type FormContextProps = {
  labelPlacement?: FormFieldPropLabelPlacement;
  labelAlign?: FormFieldPropLabelAlign;
};

export const FormContext = createContext<FormContextProps>({});

export const useForm = () => useContext(FormContext);
