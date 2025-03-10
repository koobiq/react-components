import type { ElementType } from 'react';

import type { AriaButtonOptions } from '@react-aria/button';

export type ButtonOptions = Omit<
  AriaButtonOptions<ElementType>,
  'isDisabled'
> & {
  /** Whether the button is disabled. */
  disabled?: boolean;
  /** Handler that is called when the press is released over the target. */
  onClick?: AriaButtonOptions<ElementType>['onPress'];
};
