'use client';

import { forwardRef } from 'react';
import type { ComponentRef } from 'react';

import { useRadioGroup, useRadioGroupState } from '../../behaviors';
import { useRenderProps, Provider } from '../../utils';
import { LabelContext } from '../Label';
import { TextContext } from '../Text';

import { RadioContext } from './index';
import type { RadioGroupProps } from './index';

export const RadioGroup = forwardRef<ComponentRef<'div'>, RadioGroupProps>(
  (props, ref) => {
    const state = useRadioGroupState(props);

    const { radioGroupProps, labelProps, descriptionProps } = useRadioGroup(
      props,
      state
    );

    const renderProps = useRenderProps({
      ...props,
      values: {
        orientation: props.orientation || 'vertical',
        isDisabled: state.isDisabled,
        isReadOnly: state.isReadOnly,
        isRequired: state.isRequired,
        isInvalid: state.isInvalid,
        state,
      },
    });

    return (
      <div {...radioGroupProps} {...renderProps} ref={ref}>
        <Provider
          values={[
            [RadioContext, state],
            [LabelContext, labelProps],
            [
              TextContext,
              {
                slots: {
                  description: descriptionProps,
                },
              },
            ],
          ]}
        >
          {renderProps.children}
        </Provider>
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
