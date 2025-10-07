import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCircleXs24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      fill="currentColor"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M16.5 12a4.5 4.5 0 1 0-9 0 4.5 4.5 0 0 0 9 0"
      />
    </svg>
  )
);
IconCircleXs24.displayName = 'IconCircleXs24';
