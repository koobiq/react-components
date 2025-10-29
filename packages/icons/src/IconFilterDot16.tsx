import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconFilterDot16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path
        fill="var(--icon-accent-color, currentColor)"
        d="M16 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0"
      />
      <path d="M10.8 2H2.2a.2.2 0 0 0-.2.2v1.2c0 .378.178.733.48.96L6 7v5.258c0 .455.257.87.663 1.074l3.048 1.523a.2.2 0 0 0 .289-.179V7l2.742-2.057A3.2 3.2 0 0 1 10.8 2" />
    </svg>
  )
);
IconFilterDot16.displayName = 'IconFilterDot16';
