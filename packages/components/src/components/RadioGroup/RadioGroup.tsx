'use client';

import { forwardRef, type ComponentRef } from 'react';

import { deprecate } from '@koobiq/logger';
import { mergeProps } from '@koobiq/react-core';
import { RadioGroup as RadioGroupPrimitive } from '@koobiq/react-primitives';

import { useForm } from '../Form';
import type {
  FormFieldProps,
  FormFieldLabelProps,
  FormFieldErrorProps,
  FormFieldCaptionProps,
} from '../FormField';
import { FormField } from '../FormField';
import { flex } from '../layout';

import { RadioGroupContext } from './index';
import type { RadioGroupProps } from './index';
import s from './RadioGroup.module.css';

export const RadioGroup = forwardRef<ComponentRef<'div'>, RadioGroupProps>(
  (props, ref) => {
    const {
      size = 'normal',
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

    const { isDisabled: formIsDisabled, isReadOnly: formIsReadOnly } =
      useForm();

    const caption = captionProp ?? description;
    const isDisabled = isDisabledProp ?? disabled ?? formIsDisabled;
    const isInvalid = isInvalidProp ?? error;
    const isReadOnly = isReadOnlyProp ?? readonly ?? formIsReadOnly;
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
      (FormFieldProps<typeof RadioGroupPrimitive> | undefined)[]
    >(
      {
        ...props,
        style,
        labelPlacement,
        className,
        labelAlign,
        isDisabled,
        isInvalid,
        isReadOnly,
        isRequired,
        ref,
        'data-size': size,
        'data-testid': testId,
        'data-orientation': orientation,
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
        <FormField as={RadioGroupPrimitive} {...rootProps}>
          {({ isRequired }) => {
            const labelProps = mergeProps<
              (FormFieldLabelProps<'span'> | undefined)[]
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

            const errorProps = mergeProps<(FormFieldErrorProps | undefined)[]>(
              { children: errorMessage },
              slotProps?.errorMessage
            );

            const captionProps = mergeProps<
              (FormFieldCaptionProps | undefined)[]
            >({ children: caption }, slotProps?.caption);

            return (
              <>
                <FormField.Label {...labelProps} />
                <div className={s.body}>
                  <div {...radioGroupProps}>{children}</div>
                  <FormField.Error {...errorProps} />
                  <FormField.Caption {...captionProps} />
                </div>
              </>
            );
          }}
        </FormField>
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
