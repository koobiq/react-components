import type { ElementType } from 'react';

import type { AriaButtonOptions } from '@react-aria/button';
import type { AriaLinkOptions } from '@react-aria/link';

export type ButtonOptions = Omit<
  AriaButtonOptions<ElementType>,
  'isDisabled'
> & {
  /** Whether the button is disabled. */
  disabled?: boolean;
};

export type LinkOptions = Omit<AriaLinkOptions, 'isDisabled'> & {
  /** Whether the button is disabled. */
  disabled?: boolean;
};
