import { type CSSProperties, forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';
import { Form as FormPrimitive } from '@koobiq/react-primitives';

import { getResponsiveValue } from '../../utils';
import { useMatchedBreakpoints } from '../Provider';

import { FormGroup, FormCaption, FormActions } from './components';
import s from './Form.module.css';
import { FormContext } from './FormContext';
import type { FormRef, FormProps } from './types';
import { templatePresets } from './utils';

const FormComponent = forwardRef<FormRef, FormProps>((props, ref) => {
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
        '--label-inline-size': templatePresets[labelInlineSize],
      } as CSSProperties)
    : undefined;

  return (
    <FormContext.Provider
      value={{ labelPlacement, labelAlign, isDisabled, isReadOnly }}
    >
      <FormPrimitive
        data-label-align={labelAlign}
        data-orientation={orientation}
        data-label-placement={labelPlacement}
        data-readonly={isReadOnly || undefined}
        data-disabled={isDisabled || undefined}
        className={clsx(s.base, s[orientation], className)}
        style={{ ...style, ...formStyle }}
        {...other}
        ref={ref}
      />
    </FormContext.Provider>
  );
});

FormComponent.displayName = 'Form';

type CompoundedComponent = typeof FormComponent & {
  Group: typeof FormGroup;
  Caption: typeof FormCaption;
  Actions: typeof FormActions;
};

export const Form = FormComponent as CompoundedComponent;

Form.Group = FormGroup;
Form.Caption = FormCaption;
Form.Actions = FormActions;
