import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconSquareDot16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g fill="var(--icon-accent-color, currentColor)">
        <path d="M16 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
        <path d="M16 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
      </g>
      <path d="M15 5.04q-.474.158-1 .16A3.2 3.2 0 0 1 10.96 1H2.2A1.2 1.2 0 0 0 1 2.2v11.6A1.2 1.2 0 0 0 2.2 15h11.6a1.2 1.2 0 0 0 1.2-1.2z" />
    </svg>
  )
);
IconSquareDot16.displayName = 'IconSquareDot16';
