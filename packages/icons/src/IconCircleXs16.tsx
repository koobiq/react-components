import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCircleXs16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <path fill="currentColor" d="M11 8a3 3 0 1 0-6 0 3 3 0 0 0 6 0" />
    </svg>
  )
);
IconCircleXs16.displayName = 'IconCircleXs16';
