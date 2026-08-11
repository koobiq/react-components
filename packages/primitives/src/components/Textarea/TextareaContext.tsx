'use client';

import { TextAreaContext, useSlottedContext } from 'react-aria-components';

export { TextAreaContext as TextareaContext };

export const useTextareaContext = () =>
  useSlottedContext(TextAreaContext) ?? {};
