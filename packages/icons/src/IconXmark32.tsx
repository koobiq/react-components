import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconXmark32 = forwardRef(
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
      <path d="m18.117 15.995 7.364 7.364-2.122 2.122-7.364-7.364-7.364 7.364-2.121-2.122 7.364-7.364L6.51 8.631 8.631 6.51l7.364 7.364L23.36 6.51l2.122 2.121z" />
    </svg>
  )
);
IconXmark32.displayName = 'IconXmark32';
