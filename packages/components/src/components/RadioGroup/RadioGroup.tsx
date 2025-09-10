'use client';

import { forwardRef, type ComponentRef } from 'react';

import { deprecate } from '@koobiq/logger';
import { mergeProps } from '@koobiq/react-core';
import { RadioGroup as RadioGroupPrimitive } from '@koobiq/react-primitives';

import {
  Field,
  FieldCaption,
  type FieldCaptionProps,
  FieldError,
  type FieldErrorProps,
} from '../FieldComponents';
import { FormControl, type FormControlProps } from '../FormControl';
import {
  FormControlLabel,
  type FormControlLabelProps,
} from '../FormControlLabel';
import { flex } from '../layout';

import { RadioGroupContext } from './index';
import type { RadioGroupProps } from './index';
import s from './RadioGroup.module.css';

export const RadioGroup = forwardRef<ComponentRef<'div'>, RadioGroupProps>(
  (props, ref) => {
    const {
      size,
      label,
      children,
      slotProps,
      style,
      className,
      description,
      caption: captionProp,
      orientation,
      isInvalid: isInvalidProp,
      isDisabled: isDisabledProp,
      isRequired: isRequiredProp,
      isReadOnly: isReadOnlyProp,
      'data-testid': testId,
      errorMessage,
      labelAlign,
      labelPlacement,
      isLabelHidden,
      disabled,
      error,
      readonly,
      required,
    } = props;

    const caption = captionProp ?? description;
    const isDisabled = isDisabledProp ?? disabled;
    const isInvalid = isInvalidProp ?? error;
    const isReadOnly = isReadOnlyProp ?? readonly;
    const isRequired = isRequiredProp ?? required;

    if (process.env.NODE_ENV !== 'production' && 'description' in props) {
      deprecate(
        'RadioGroup: the "description" prop is deprecated. Use "caption" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'disabled' in props) {
      deprecate(
        'RadioGroup: the "disabled" prop is deprecated. Use "isDisabled" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'error' in props) {
      deprecate(
        'RadioGroup: the "error" prop is deprecated. Use "isInvalid" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'readonly' in props) {
      deprecate(
        'RadioGroup: the "readonly" prop is deprecated. Use "isReadOnly" prop to replace it.'
      );
    }

    if (process.env.NODE_ENV !== 'production' && 'required' in props) {
      deprecate(
        'RadioGroup: the "required" prop is deprecated. Use "isRequired" prop to replace it.'
      );
    }

    const rootProps = mergeProps<
      [
        FormControlProps<typeof RadioGroupPrimitive>,
        FormControlProps<typeof RadioGroupPrimitive> | undefined,
      ]
    >(
      {
        style,
        labelPlacement,
        className,
        labelAlign,
        isDisabled,
        isInvalid,
        isReadOnly,
        isRequired,
        ...props,
        ref,
        'data-size': size,
        'data-testid': testId,
        'data-invalid': isInvalid,
        'data-disabled': isDisabled,
        'data-required': isRequired,
        'data-readonly': isReadOnly,
      },
      slotProps?.root
    );

    const radioGroupProps = mergeProps(
      {
        className: flex({
          direction: orientation === 'horizontal' ? 'row' : 'column',
          alignItems: orientation === 'horizontal' ? 'center' : 'flex-start',
          gap: 's',
        }),
      },
      slotProps?.radioGroup
    );

    return (
      <RadioGroupContext.Provider value={{ size }}>
        <FormControl as={RadioGroupPrimitive} {...rootProps}>
          {({ isRequired }) => {
            const labelProps = mergeProps<
              [
                FormControlLabelProps<'span'>,
                FormControlLabelProps<'span'> | undefined,
              ]
            >(
              {
                as: 'span',
                isRequired,
                children: label,
                className: s.label,
                isHidden: isLabelHidden,
              },
              slotProps?.label
            );

            const errorProps = mergeProps<
              [FieldErrorProps, FieldErrorProps | undefined]
            >({ children: errorMessage }, slotProps?.errorMessage);

            const captionProps = mergeProps<
              [FieldCaptionProps, FieldCaptionProps | undefined]
            >({ children: caption }, slotProps?.caption);

            return (
              <>
                <FormControlLabel {...labelProps} />
                <Field>
                  <div {...radioGroupProps}>{children}</div>
                  <FieldCaption {...captionProps} />
                  <FieldError {...errorProps} />
                </Field>
              </>
            );
          }}
        </FormControl>
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
