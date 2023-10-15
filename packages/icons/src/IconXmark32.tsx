import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconXmark32 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={32}
      height={32}
      fill="currentColor"
      viewBox="0 0 32 32"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="m18.117 15.995 7.364 7.364-2.122 2.121-7.364-7.364-7.364 7.364L6.51 23.36l7.364-7.364L6.51 8.631 8.631 6.51l7.364 7.364L23.36 6.51l2.122 2.121z"
      />
    </svg>
  )
);
IconXmark32.displayName = 'IconXmark32';
