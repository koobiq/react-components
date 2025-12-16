import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconList32 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="M9 6H5v4h4zM12 7h15v2H12zM27 15H12v2h15zM27 23H12v2h15zM9 22H5v4h4zM5 14h4v4H5z" />
      </g>
    </svg>
  )
);
IconList32.displayName = 'IconList32';
