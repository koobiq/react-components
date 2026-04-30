import { Children, type ComponentRef, type ReactNode, forwardRef } from 'react';

import type { ExtendableComponentPropsWithRef } from '@koobiq/react-core';
import { clsx } from '@koobiq/react-core';

import s from './DropdownFooter.module.css';

export type DropdownFooterProps = ExtendableComponentPropsWithRef<
  {
    /** Content to display inside the dropdown footer. */
    children?: ReactNode;
  },
  'div'
>;

export type DropdownFooterRef = ComponentRef<'div'>;

export const DropdownFooter = forwardRef<
  DropdownFooterRef,
  DropdownFooterProps
>(({ children, className, ...other }, ref) => {
  if (!Children.toArray(children).length) return null;

  return (
    <div className={clsx(s.base, className)} {...other} ref={ref}>
      {children}
    </div>
  );
});

DropdownFooter.displayName = 'DropdownFooter';
