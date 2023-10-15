import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconMessageDot24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      fill="currentColor"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M18.14 2.093A3 3 0 0 1 19.766.264a3 3 0 1 1-1.627 1.83" />
        <path d="M18.14 2.093A3 3 0 0 1 19.766.264a3 3 0 1 1-1.627 1.83" />
      </g>
      <path
        fill="currentColor"
        d="M5.1 3h11.1a4.8 4.8 0 0 0 6.3 4.561V15.9a3.6 3.6 0 0 1-3.6 3.6h-7.275l-5.138 4.11A.3.3 0 0 1 6 23.376V19.5h-.9a3.6 3.6 0 0 1-3.6-3.6V6.6A3.6 3.6 0 0 1 5.1 3m6.9 9.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m6-1.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0m-10.5 1.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"
      />
    </svg>
  )
);
IconMessageDot24.displayName = 'IconMessageDot24';
