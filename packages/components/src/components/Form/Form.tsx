import { forwardRef } from 'react';

import { Form as FormPrimitive } from '@koobiq/react-primitives';

import { FormContext } from './FormContext';
import type { FormRef, FormProps } from './types';

export const Form = forwardRef<FormRef, FormProps>((props, ref) => (
  <FormContext.Provider value={{}}>
    <FormPrimitive {...props} ref={ref} />
  </FormContext.Provider>
));

Form.displayName = 'Form';
