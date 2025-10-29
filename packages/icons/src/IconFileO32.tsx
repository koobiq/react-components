import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconFileO32 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="M18 8.5V3H7.818C6.814 3 6 3.831 6 4.857v22.286C6 28.169 6.814 29 7.818 29h16.364C25.186 29 26 28.169 26 27.143V11h-5.5C19.496 11 18 9.526 18 8.5M8 27V5h8v3a5 5 0 0 0 5 5h3v14z" />
        <path d="M20 8a1 1 0 0 0 1 1h5l-6-6z" />
      </g>
    </svg>
  )
);
IconFileO32.displayName = 'IconFileO32';
