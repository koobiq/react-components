import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCircleHalf16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0-1.6A5.4 5.4 0 0 0 8 2.6v10.8" />
    </svg>
  )
);
IconCircleHalf16.displayName = 'IconCircleHalf16';
