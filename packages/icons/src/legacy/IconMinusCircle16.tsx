import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

/**
 * @deprecated
 * This icon has been deprecated, please use IconCircleMinus16 instead.
 */
export const IconMinusCircle16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m3.8-7.8c.11 0 .2.09.2.2v1.2a.2.2 0 0 1-.2.2H4.2a.2.2 0 0 1-.2-.2V7.4c0-.11.09-.2.2-.2z" />
    </svg>
  )
);
IconMinusCircle16.displayName = 'IconMinusCircle16';
