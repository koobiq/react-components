import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconFilter16 = forwardRef(
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
        d="M13.8 2H2.2a.2.2 0 0 0-.2.2v1.2c0 .378.178.733.48.96L6 7v5.258c0 .455.257.87.663 1.074l3.048 1.523a.2.2 0 0 0 .289-.179V7l3.52-2.64A1.2 1.2 0 0 0 14 3.4V2.2a.2.2 0 0 0-.2-.2"
      />
    </svg>
  )
);
IconFilter16.displayName = 'IconFilter16';
