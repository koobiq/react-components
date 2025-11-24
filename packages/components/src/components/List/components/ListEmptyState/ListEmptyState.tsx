import type { FC, ReactNode } from 'react';

import { clsx } from '@koobiq/react-core';

import { utilClasses } from '../../../../styles/utility';
import { isPrimitiveNode } from '../../../../utils';

import s from './ListEmptyState.module.css';

export type ListEmptyStateProps = {
  isEmpty?: boolean;
  isLoading?: boolean;
  noItemsText?: ReactNode;
};

const { typography } = utilClasses;

export const ListEmptyState: FC<ListEmptyStateProps> = ({
  isEmpty,
  isLoading,
  noItemsText,
}) => {
  if (noItemsText === null || !isEmpty || isLoading) {
    return null;
  }

  const style = isPrimitiveNode(noItemsText)
    ? undefined
    : { display: 'contents' };

  return (
    <li className={clsx(s.empty, typography['text-normal'])} style={style}>
      {noItemsText}
    </li>
  );
};
