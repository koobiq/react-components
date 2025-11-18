import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconSquareMinus24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M3.3 1.5a1.8 1.8 0 0 0-1.8 1.8v17.4a1.8 1.8 0 0 0 1.8 1.8h17.4a1.8 1.8 0 0 0 1.8-1.8V3.3a1.8 1.8 0 0 0-1.8-1.8zm14.4 11.4H6.3a.3.3 0 0 1-.3-.3v-1.2a.3.3 0 0 1 .3-.3h11.4a.3.3 0 0 1 .3.3v1.2a.3.3 0 0 1-.3.3" />
    </svg>
  )
);
IconSquareMinus24.displayName = 'IconSquareMinus24';
