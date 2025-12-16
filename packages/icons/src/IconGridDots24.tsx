import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconGridDots24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M15.75 4.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0M4.5 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5M23.25 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0M12 23.25a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5m0-5.7a1.95 1.95 0 1 1 0 3.9 1.95 1.95 0 0 1 0-3.9" />
    </svg>
  )
);
IconGridDots24.displayName = 'IconGridDots24';
