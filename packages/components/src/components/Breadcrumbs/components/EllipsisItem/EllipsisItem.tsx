import { type ComponentPropsWithRef, forwardRef } from 'react';

import { clsx } from '@koobiq/react-core';
import { IconEllipsisHorizontal16 } from '@koobiq/react-icons';

import s from '../../Breadcrumbs.module.css';

export type EllipsisItemProps = ComponentPropsWithRef<'li'>;

export const EllipsisItem = forwardRef<HTMLLIElement, EllipsisItemProps>(
  (props, ref) => {
    const { className, ...other } = props;

    return (
      <li ref={ref} className={clsx(s.ellipsis, className)} {...other}>
        <IconEllipsisHorizontal16 />
      </li>
    );
  }
);

EllipsisItem.displayName = 'EllipsisItem';
