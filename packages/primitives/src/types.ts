import type { ElementType } from 'react';

import type { AriaButtonOptions } from '@react-aria/button';

export type ButtonOptions = Omit<
  AriaButtonOptions<ElementType>,
  'isDisabled'
> & {
  /** Whether the button is disabled. */
  disabled?: boolean;
};
