import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCircleMinusO24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="M17.313 11.1v1.8c0 .166-.434.3-.3.3H6.993a.3.3 0 0 1-.3-.3v-1.8a.3.3 0 0 1 .3-.3h10.02c-.134 0 .3.134.3.3" />
        <path d="M12 20.1a8.1 8.1 0 1 1 0-16.2 8.1 8.1 0 0 1 0 16.2m0 2.4c5.799 0 10.5-4.701 10.5-10.5S17.799 1.5 12 1.5 1.5 6.201 1.5 12 6.201 22.5 12 22.5" />
      </g>
    </svg>
  )
);
IconCircleMinusO24.displayName = 'IconCircleMinusO24';
