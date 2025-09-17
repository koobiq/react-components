import { type CSSProperties, forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';
import { Form as FormPrimitive } from '@koobiq/react-primitives';

import { getResponsiveValue } from '../../utils';
import { useMatchedBreakpoints } from '../Provider';

import s from './Form.module.css';
import { FormContext } from './FormContext';
import type { FormRef, FormProps } from './types';
import { templatePresets } from './utils';

export const Form = forwardRef<FormRef, FormProps>((props, ref) => {
  const {
    labelPlacement: labelPlacementProp,
    labelAlign: labelAlignProp,
    labelInlineSize: labelInlineSizeProp,
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
    <FormContext.Provider value={{ labelPlacement, labelAlign }}>
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

Form.displayName = 'Form';
