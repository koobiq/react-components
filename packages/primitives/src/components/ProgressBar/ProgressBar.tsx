'use client';

import { mergeProps, polymorphicForwardRef } from '@koobiq/react-core';

import { useProgressBar } from '../../behaviors';
import { Provider, useRenderProps } from '../../utils';
import { LabelContext } from '../Label';

import type { ProgressBarBaseProps } from './index';

export const ProgressBar = polymorphicForwardRef<'div', ProgressBarBaseProps>(
  (props, ref) => {
    const {
      value = 0,
      minValue = 0,
      maxValue = 100,
      as: Tag = 'div',
      indeterminate = false,
      ...other
    } = props;

    const { progressBarProps, labelProps } = useProgressBar(props);

    const percentage = indeterminate
      ? undefined
      : ((value - minValue) / (maxValue - minValue)) * 100;

    const renderValues = {
      indeterminate,
      percentage,
    };

    const renderProps = useRenderProps({
      ...props,
      values: renderValues,
    });

    return (
      <Tag {...mergeProps(other, progressBarProps, renderProps)} ref={ref}>
        <Provider values={[[LabelContext, labelProps]]}>
          {renderProps.children}
        </Provider>
      </Tag>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';
