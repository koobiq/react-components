import { clsx } from '@koobiq/react-core';

import s from './flex.module.css';
import type { FlexParams } from './types';

/** The flex mixin turns the element it’s applied to into a flex container. */
export const flex: FlexParams = (props, className) => {
  const {
    alignItems,
    justifyContent,
    flex,
    wrap,
    direction,
    gap,
    rowGap: rowGapProp,
    colGap: colGapProp,
    order,
  } = props;

  const colGap = colGapProp ?? gap;
  const rowGap = rowGapProp ?? gap;

  return clsx(
    s.base,
    flex && s[`flex_${flex}`],
    wrap && s[`wrap_${wrap}`],
    order !== undefined && s[`order_${order}`],
    rowGap && s[`gap_row_${rowGap}`],
    colGap && s[`gap_column_${colGap}`],
    direction && s[`direction_${direction}`],
    alignItems && s[`alignItems_${alignItems}`],
    justifyContent && s[`justifyContent_${justifyContent}`],
    className
  );
};
