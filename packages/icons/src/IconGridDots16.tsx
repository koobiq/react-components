import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconGridDots16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M10.5 3a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0M3 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5M15.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0M8 15.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5m0-3.8a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6"
      />
    </svg>
  )
);
IconGridDots16.displayName = 'IconGridDots16';
