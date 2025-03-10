'use client';

import type { ComponentPropsWithRef, CSSProperties, ElementType } from 'react';

import { clsx, polymorphicForwardRef } from '@koobiq/react-core';

import { getResponsiveValue } from '../../../../utils';
import { useMatchedBreakpoints } from '../../../Provider';

import s from './GridItem.module.css';
import type { GridItemBaseProps } from './types';

export const GridItem = polymorphicForwardRef<'div', GridItemBaseProps>(
  (
    {
      as: Tag = 'div',
      children,
      className,
      style: styleProp,
      col: colProp,
      row: rowProp,
      colStart: colStartProp,
      rowStart: rowStartProp,
      alignSelf: alignSelfProp,
      justifySelf: justifySelfProp,
      ...other
    },
    ref
  ) => {
    const breakpoints = useMatchedBreakpoints();

    const col = getResponsiveValue(colProp, breakpoints);
    const colStart = getResponsiveValue(colStartProp, breakpoints);
    const row = getResponsiveValue(rowProp, breakpoints);
    const rowStart = getResponsiveValue(rowStartProp, breakpoints);
    const alignSelf = getResponsiveValue(alignSelfProp, breakpoints);
    const justifySelf = getResponsiveValue(justifySelfProp, breakpoints);

    const style = {
      ...styleProp,
      '--grid-item-col-end': col,
      '--grid-item-col-start': colStart ? `${colStart} / span` : undefined,
      '--grid-item-row-end': row,
      '--grid-item-row-start': rowStart ? `${rowStart} / span` : undefined,
      '--grid-align-self': alignSelf,
      '--grid-justify-self': justifySelf,
    } as CSSProperties;

    return (
      <Tag
        style={style}
        className={clsx(s.base, className)}
        {...other}
        ref={ref}
      >
        {children}
      </Tag>
    );
  }
);

GridItem.displayName = 'GridItem';

export type GridItemProps<As extends ElementType = 'div'> =
  ComponentPropsWithRef<typeof GridItem<As>>;
