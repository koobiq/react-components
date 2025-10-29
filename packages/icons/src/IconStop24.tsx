import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconStop24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M4.5 6.3a1.8 1.8 0 0 1 1.8-1.8h11.4a1.8 1.8 0 0 1 1.8 1.8v11.4a1.8 1.8 0 0 1-1.8 1.8H6.3a1.8 1.8 0 0 1-1.8-1.8z" />
    </svg>
  )
);
IconStop24.displayName = 'IconStop24';
