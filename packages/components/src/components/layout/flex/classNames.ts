import { clsx } from '@koobiq/react-core';

import type { FlexProps } from './types';

const baseClassName = 'kbq-flex';

export const getFlexClassNames = (
  props: FlexProps,
  className?: string
): string => {
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
    baseClassName,
    flex && `${baseClassName}-flex_${flex}`,
    wrap && `${baseClassName}-wrap_${wrap}`,
    order !== undefined && `${baseClassName}-order_${order}`,
    rowGap && `${baseClassName}-gap_row_${rowGap}`,
    colGap && `${baseClassName}-gap_column_${colGap}`,
    direction && `${baseClassName}-direction_${direction}`,
    alignItems && `${baseClassName}-alignItems_${alignItems}`,
    justifyContent && `${baseClassName}-justifyContent_${justifyContent}`,
    className
  );
};
