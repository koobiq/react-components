import type {
  ComponentPropsWithRef,
  ComponentRef,
  CSSProperties,
  ReactElement,
  Ref,
} from 'react';

import type { ExtendableProps } from '@koobiq/react-core';
import type { AriaCalendarProps, DateValue } from '@koobiq/react-primitives';

import type { CalendarGridProps, CalendarHeaderProps } from './components';

export type CalendarProps<T extends DateValue> = ExtendableProps<
  {
    /** Ref to the root container. */
    ref?: Ref<HTMLDivElement>;
    /** Additional CSS-classes. */
    className?: string;
    /** Inline styles. */
    style?: CSSProperties;
    /** The props used for each slot inside. */
    slotProps?: {
      root?: ComponentPropsWithRef<'div'>;
      grid?: Partial<CalendarGridProps>;
      header?: Partial<CalendarHeaderProps>;
    };
  },
  Omit<AriaCalendarProps<T>, 'validationState' | 'errorMessage'>
>;

export type CalendarComponent = <T extends DateValue>(
  props: CalendarProps<T>
) => ReactElement | null;

export type CalendarRef = ComponentRef<'div'>;
