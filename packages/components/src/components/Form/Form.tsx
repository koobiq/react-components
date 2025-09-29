import { type CSSProperties, forwardRef } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';
import { Form as FormPrimitive } from '@koobiq/react-primitives';

import { getResponsiveValue } from '../../utils';
import { useMatchedBreakpoints } from '../Provider';
import { Typography, type TypographyProps } from '../Typography';

import s from './Form.module.css';
import { FormContext } from './FormContext';
import type { FormRef, FormProps } from './types';
import { templatePresets } from './utils';

export const FormComponent = forwardRef<FormRef, FormProps>((props, ref) => {
  const {
    labelPlacement: labelPlacementProp,
    labelAlign: labelAlignProp,
    labelInlineSize: labelInlineSizeProp,
    isReadOnly,
    isDisabled,
    className,
    style,
    ...other
  } = props;

  const breakpoints = useMatchedBreakpoints();

  const labelPlacement = getResponsiveValue(labelPlacementProp, breakpoints);
  const labelAlign = getResponsiveValue(labelAlignProp, breakpoints);
  const labelInlineSize = getResponsiveValue(labelInlineSizeProp, breakpoints);

  const orientation = labelPlacement === 'side' ? 'horizontal' : 'vertical';

  const formStyle = labelInlineSize
    ? ({
        '--template-columns': templatePresets[labelInlineSize],
      } as CSSProperties)
    : undefined;

  return (
    <FormContext.Provider
      value={{ labelPlacement, labelAlign, isDisabled, isReadOnly }}
    >
      <FormPrimitive
        data-orientation={orientation}
        className={clsx(s.base, s[orientation], className)}
        style={{ ...style, ...formStyle }}
        {...other}
        ref={ref}
      />
    </FormContext.Provider>
  );
});

export const Fieldset = polymorphicForwardRef<'div', { className?: string }>(
  ({ className, as: Tag = 'fieldset', ...other }, ref) => (
    <Tag className={clsx(s.fieldset, className)} {...other} ref={ref} />
  )
);

export const Legend = polymorphicForwardRef<'p', TypographyProps>(
  ({ className, as = 'p', ...other }, ref) => (
    <Typography
      as={as}
      variant="text-big"
      className={clsx(s.legend, className)}
      {...other}
      ref={ref}
    />
  )
);

FormComponent.displayName = 'Form';

type CompoundedComponent = typeof FormComponent & {
  Fieldset: typeof Fieldset;
  Legend: typeof Legend;
};

export const Form = FormComponent as CompoundedComponent;

Form.Fieldset = Fieldset;
Form.Legend = Legend;
