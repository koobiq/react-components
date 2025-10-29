import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconNorthEast24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M9 6h9v9h-1.5V8.56L5.03 20.03l-1.06-1.06L15.44 7.5H9z"
        clipRule="evenodd"
      />
    </svg>
  )
);
IconNorthEast24.displayName = 'IconNorthEast24';
