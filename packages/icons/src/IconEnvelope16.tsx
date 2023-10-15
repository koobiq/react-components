import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconEnvelope16 = forwardRef(
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
        <path d="M0 3.2C0 2.537.614 2 1.371 2H14.63C15.386 2 16 2.537 16 3.2v.403l-7.88 3.84a.26.26 0 0 1-.24 0L0 3.603z" />
        <path d="M16 5.01v7.79c0 .663-.614 1.2-1.371 1.2H1.37C.614 14 0 13.463 0 12.8V5.01l7.88 3.841c.074.04.166.04.24 0z" />
      </g>
    </svg>
  )
);
IconEnvelope16.displayName = 'IconEnvelope16';
