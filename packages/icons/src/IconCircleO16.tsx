import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCircleO16 = forwardRef(
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
        d="M8 13.4A5.4 5.4 0 1 1 8 2.6a5.4 5.4 0 0 1 0 10.8M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14"
      />
    </svg>
  )
);
IconCircleO16.displayName = 'IconCircleO16';
