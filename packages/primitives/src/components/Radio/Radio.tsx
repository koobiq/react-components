'use client';

import { type ComponentRef, forwardRef, useContext } from 'react';

import { useDOMRef, mergeProps, filterDOMProps } from '@koobiq/react-core';
import { VisuallyHidden } from '@react-aria/visually-hidden';

import { useRadio } from '../../behaviors';
import { removeDataAttributes, useRenderProps } from '../../utils';

import type { RadioProps } from './index';
import { RadioContext } from './index';

export const Radio = forwardRef<ComponentRef<'label'>, RadioProps>(
  (props, ref) => {
    const { children, inputRef } = props;

    const state = useContext(RadioContext);
    const { error } = state;

    const domRef = useDOMRef<ComponentRef<'input'>>(inputRef);

    const {
      hovered,
      focused,
      pressed,
      focusVisible,
      labelProps,
      inputProps,
      disabled,
      checked,
    } = useRadio(
      {
        ...removeDataAttributes(props),
        children: typeof children === 'function' ? true : children,
      },
      state,
      domRef
    );

    const renderValues = {
      error,
      hovered,
      checked,
      focused,
      pressed,
      disabled,
      focusVisible,
    };

    const renderProps = useRenderProps({
      ...props,
      values: renderValues,
    });

    const DOMProps = filterDOMProps(props);
    delete DOMProps.id;

    return (
      <label {...mergeProps(DOMProps, labelProps, renderProps)} ref={ref}>
        <VisuallyHidden elementType="span">
          <input {...inputProps} ref={domRef} />
        </VisuallyHidden>
        {renderProps.children}
      </label>
    );
  }
);

Radio.displayName = 'Radio';
