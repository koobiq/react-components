import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCheck48 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={48}
      height={48}
      fill="currentColor"
      viewBox="0 0 48 48"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M44.621 13.621 20.5 37.743 5.379 22.62 9.62 18.38 20.5 29.257 40.379 9.38z"
      />
    </svg>
  )
);
IconCheck48.displayName = 'IconCheck48';
