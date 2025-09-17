import { createContext, useContext } from 'react';

export type FormContextProps = object;

export const FormContext = createContext<FormContextProps>({});

export const useForm = () => useContext(FormContext);
