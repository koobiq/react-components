import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCloud16 = forwardRef(
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
        d="M8.062 13H3.609a3.61 3.61 0 0 1-.091-7.218 5 5 0 0 1 9.225.63A3.294 3.294 0 0 1 12.705 13z"
      />
    </svg>
  )
);
IconCloud16.displayName = 'IconCloud16';
