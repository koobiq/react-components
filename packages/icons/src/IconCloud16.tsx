import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCloud16 = forwardRef(
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
      <path d="M8.062 13H3.609a3.61 3.61 0 0 1-.091-7.218 5 5 0 0 1 9.225.63A3.294 3.294 0 0 1 12.706 13z" />
    </svg>
  )
);
IconCloud16.displayName = 'IconCloud16';
