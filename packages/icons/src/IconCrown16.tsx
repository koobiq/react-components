import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCrown16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M7.823 1.603a.203.203 0 0 1 .354 0l2.82 4.982 4.669-3.887a.203.203 0 0 1 .328.203l-2.1 8.8.002.002h-.025V11.7H2.129v.002h-.022l-.002.002L.006 2.9a.203.203 0 0 1 .328-.203l4.669 3.887zM2.13 12.92v1.377c0 .112.09.203.202.203h11.336a.203.203 0 0 0 .203-.203V12.92z" />
      </g>
    </svg>
  )
);
IconCrown16.displayName = 'IconCrown16';
