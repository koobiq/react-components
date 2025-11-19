import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

/**
 * @deprecated
 * This icon has been deprecated, please use IconCircleMinus24 instead.
 */
export const IconMinusCircle24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M12 22.5c5.799 0 10.5-4.701 10.5-10.5S17.799 1.5 12 1.5 1.5 6.201 1.5 12 6.201 22.5 12 22.5m5.7-11.7a.3.3 0 0 1 .3.3v1.8a.3.3 0 0 1-.3.3H6.3a.3.3 0 0 1-.3-.3v-1.8a.3.3 0 0 1 .3-.3z" />
    </svg>
  )
);
IconMinusCircle24.displayName = 'IconMinusCircle24';
