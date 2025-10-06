import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconSquareDot24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      fill="currentColor"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M24 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
        <path d="M24 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
      </g>
      <path
        fill="currentColor"
        d="M22.5 7.561A4.8 4.8 0 0 1 16.439 1.5H3.3a1.8 1.8 0 0 0-1.8 1.8v17.4a1.8 1.8 0 0 0 1.8 1.8h17.4a1.8 1.8 0 0 0 1.8-1.8z"
      />
    </svg>
  )
);
IconSquareDot24.displayName = 'IconSquareDot24';
