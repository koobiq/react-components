import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconTriangleO16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="m7.95 3.041 5.684 9.364H2.366zm1.056-1.413a1.2 1.2 0 0 0-2.114 0L.64 12.238c-.429.799.2 1.767 1.057 1.767h12.606a1.2 1.2 0 0 0 1.057-1.768z" />
    </svg>
  )
);
IconTriangleO16.displayName = 'IconTriangleO16';
