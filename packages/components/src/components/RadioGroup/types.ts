import type { ComponentPropsWithRef, ReactNode } from 'react';

import type {
  ExtendableComponentPropsWithRef,
  ExtendableProps,
} from '@koobiq/react-core';
import type { UseRadioGroupProps } from '@koobiq/react-primitives';

import type {
  RadioGroupDescriptionProps,
  RadioGroupLabelProps,
} from './components';

export const radioGroupPropSize = ['normal', 'big'] as const;

export type RadioGroupPropSize = (typeof radioGroupPropSize)[number];

export const radioGroupPropOrientation = ['horizontal', 'vertical'] as const;

export type RadioGroupPropOrientation =
  (typeof radioGroupPropOrientation)[number];

export type RadioGroupBaseProps = ExtendableProps<
  {
    /** Additional CSS-classes. */
    className?: string;
    /** The content of the component. */
    children?: ReactNode;
    /**
     * Size.
     * @default 'normal'
     */
    size?: RadioGroupPropSize;
    /** The props used for each slot inside. */
    slotProps?: {
      root?: ComponentPropsWithRef<'div'>;
      description?: RadioGroupDescriptionProps;
      label?: RadioGroupLabelProps;
    };
    /**
     * The axis the Radio Button(s) should align with.
     * @default 'vertical'
     */
    orientation?: RadioGroupPropOrientation;
    /** The current value (controlled). */
    value?: UseRadioGroupProps['value'];
    /** The default value (uncontrolled). */
    defaultValue?: UseRadioGroupProps['defaultValue'];
    /** Handler that is called when the value changes. */
    onChange?: UseRadioGroupProps['onChange'];
  },
  Omit<
    UseRadioGroupProps,
    'validationBehavior' | 'validate' | 'validationState'
  >
>;

export type RadioGroupProps = ExtendableComponentPropsWithRef<
  RadioGroupBaseProps,
  'div'
>;
