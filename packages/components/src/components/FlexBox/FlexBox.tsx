'use client';

import type { ComponentPropsWithRef, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import { getResponsiveValue } from '../../utils';
import { flex as flexBox } from '../layout';
import { useMatchedBreakpoints } from '../Provider';

import type { FlexBoxBaseProps } from './index';

export const FlexBox = polymorphicForwardRef<'div', FlexBoxBaseProps>(
  (
    {
      as: Tag = 'div',
      gap: gapProp,
      wrap: wrapProp,
      flex: flexProp,
      colGap: colGapProp,
      rowGap: rowGapProp,
      direction: directionProp,
      alignItems: alignItemsProp,
      justifyContent: justifyContentProp,
      children,
      className,
      ...other
    },
    ref
  ) => {
    const breakpoints = useMatchedBreakpoints();

    const flex = getResponsiveValue(flexProp, breakpoints);
    const gap = getResponsiveValue(gapProp, breakpoints);
    const colGap = getResponsiveValue(colGapProp, breakpoints);
    const rowGap = getResponsiveValue(rowGapProp, breakpoints);
    const wrap = getResponsiveValue(wrapProp, breakpoints);
    const alignItems = getResponsiveValue(alignItemsProp, breakpoints);
    const direction = getResponsiveValue(directionProp, breakpoints);
    const justifyContent = getResponsiveValue(justifyContentProp, breakpoints);

    const flexCn = flexBox({
      gap,
      flex,
      wrap,
      colGap,
      rowGap,
      direction,
      alignItems,
      justifyContent,
    });

    return (
      <Tag className={clsx(flexCn, className)} {...other} ref={ref}>
        {children}
      </Tag>
    );
  }
);

FlexBox.displayName = 'FlexBox';

export type FlexBoxProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof FlexBox<As>>;
