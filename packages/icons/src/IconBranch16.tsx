import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBranch16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M4.6 4.908a2 2 0 1 0-1.2 0v6.184a2 2 0 1 0 1.2 0V9.6H7a6.6 6.6 0 0 0 6.299-4.622 2 2 0 1 0-1.201-.193A5.4 5.4 0 0 1 7 8.4H4.6z" />
    </svg>
  )
);
IconBranch16.displayName = 'IconBranch16';
