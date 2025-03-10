import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconThumbsDown16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M6.91 14.473c.08.046.18.032.243-.036.622-.669 3.809-4.099 4.61-5.043V1.5H4.439c-.462 0-.881.256-1.077.665C2.598 3.764 1.442 6.359 1.1 7.13A1.15 1.15 0 0 0 1 7.598v1.27c0 .654.542 1.184 1.21 1.184h4.44l-.258.996v.002q-.235.908-.473 1.814c-.132.503.081 1.038.526 1.322q.23.147.466.287M13.79 9.4c.668 0 1.21-.53 1.21-1.184V2.684c0-.654-.542-1.184-1.21-1.184h-.816v7.9z" />
      </g>
    </svg>
  )
);
IconThumbsDown16.displayName = 'IconThumbsDown16';
