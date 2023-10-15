import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCircle16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <path fill="currentColor" d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
    </svg>
  )
);
IconCircle16.displayName = 'IconCircle16';
