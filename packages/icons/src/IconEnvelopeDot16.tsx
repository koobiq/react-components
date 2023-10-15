import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconEnvelopeDot16 = forwardRef(
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
        <path d="M16 5.498a3.19 3.19 0 0 1-2.392.678L8.119 8.851a.26.26 0 0 1-.238 0L0 5.011V12.8c0 .663.614 1.2 1.371 1.2H14.63c.757 0 1.371-.537 1.371-1.2z" />
        <path d="M10.96 2H1.37C.614 2 0 2.537 0 3.2v.403l7.88 3.84c.074.04.166.04.24 0l3.922-1.911A3.195 3.195 0 0 1 10.96 2" />
      </g>
      <g fill="currentColor">
        <path d="M14 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
        <path d="M14 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4" />
      </g>
    </svg>
  )
);
IconEnvelopeDot16.displayName = 'IconEnvelopeDot16';
