'use client';

import type { ComponentPropsWithRef, CSSProperties, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import { getResponsiveValue } from '../../utils';
import { useMatchedBreakpoints } from '../Provider';

import { GridItem } from './components';
import s from './Grid.module.css';
import type { GridBaseProps } from './types';
import { normalizeGap } from './utils';

const GridComponent = polymorphicForwardRef<'div', GridBaseProps>(
  (
    {
      as: Tag = 'div',
      gap: gapProp,
      cols: colsProp,
      style: styleProp,
      colGap: colGapProp,
      rowGap: rowGapProp,
      alignItems: alignItemsProp,
      justifyItems: justifyItemsProp,
      children,
      className,
      ...other
    },
    ref
  ) => {
    const breakpoints = useMatchedBreakpoints();

    const cols = getResponsiveValue(colsProp, breakpoints);
    const gap = getResponsiveValue(gapProp, breakpoints);
    const colGap = getResponsiveValue(colGapProp, breakpoints);
    const rowGap = getResponsiveValue(rowGapProp, breakpoints);
    const alignItems = getResponsiveValue(alignItemsProp, breakpoints);
    const justifyItems = getResponsiveValue(justifyItemsProp, breakpoints);

    const style = {
      ...styleProp,
      '--grid-cols': cols,
      '--grid-col-gap': normalizeGap(colGap ?? gap),
      '--grid-row-gap': normalizeGap(rowGap ?? gap),
      '--grid-align-items': alignItems,
      '--grid-justify-items': justifyItems,
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

GridComponent.displayName = 'Grid';

export type GridProps<As extends ElementType = 'div'> = ComponentPropsWithRef<
  typeof GridComponent<As>
>;

type CompoundedComponent = typeof GridComponent & {
  Item: typeof GridItem;
};

export const Grid = GridComponent as CompoundedComponent;

Grid.Item = GridItem;
