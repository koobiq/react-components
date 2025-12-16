import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconNorthEast16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M6 4h6v6h-1V5.707l-7.646 7.647-.708-.708L10.293 5H6z"
        clipRule="evenodd"
      />
    </svg>
  )
);
IconNorthEast16.displayName = 'IconNorthEast16';
