import type { ComponentPropsWithRef, CSSProperties, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import { getResponsiveValue } from '../../utils';
import { useMatchedBreakpoints } from '../Provider';

import s from './Container.module.css';
import type { ContainerBaseProps } from './index';
import {
  normalizeMargins,
  normalizeMaxInlineSize,
  normalizePosition,
} from './utils';

export const Container = polymorphicForwardRef<'div', ContainerBaseProps>(
  (props, ref) => {
    const {
      as: Tag = 'div',
      margins: marginsProp = 0,
      position: positionProp = 'center',
      fixed = false,
      children,
      className,
      maxInlineSize: maxInlineSizeProp,
      style: styleProp,
      ...other
    } = props;

    const breakpoints = useMatchedBreakpoints();

    const maxInlineSize = getResponsiveValue(maxInlineSizeProp, breakpoints);
    const position = getResponsiveValue(positionProp, breakpoints);
    const margins = getResponsiveValue(marginsProp, breakpoints);

    const style = {
      ...styleProp,
      '--container-max-inline-size': fixed
        ? undefined
        : normalizeMaxInlineSize(maxInlineSize),
      '--container-position': normalizePosition(position),
      '--container-margins': normalizeMargins(margins),
    } as CSSProperties;

    return (
      <Tag
        className={clsx(s.base, className)}
        style={style}
        {...other}
        ref={ref}
      >
        {children}
      </Tag>
    );
  }
);

Container.displayName = 'Container';

export type ContainerProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof Container<As>>;
