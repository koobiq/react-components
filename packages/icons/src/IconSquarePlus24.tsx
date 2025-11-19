import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconSquarePlus24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M3.3 1.5a1.8 1.8 0 0 0-1.8 1.8v17.4a1.8 1.8 0 0 0 1.8 1.8h17.4a1.8 1.8 0 0 0 1.8-1.8V3.3a1.8 1.8 0 0 0-1.8-1.8zm7.89 16.414a.3.3 0 0 1-.09-.214v-4.8H6.3a.3.3 0 0 1-.3-.3v-1.2a.3.3 0 0 1 .3-.3h4.8V6.3a.3.3 0 0 1 .16-.266A.3.3 0 0 1 11.4 6h1.2a.3.3 0 0 1 .3.3v4.8h4.8a.3.3 0 0 1 .3.3v1.2a.3.3 0 0 1-.3.3h-4.8v4.8a.3.3 0 0 1-.3.3h-1.2a.3.3 0 0 1-.21-.086" />
    </svg>
  )
);
IconSquarePlus24.displayName = 'IconSquarePlus24';
