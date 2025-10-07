import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconDesktop24 = forwardRef(
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
        <path d="M1.5 3.3a1.8 1.8 0 0 1 1.8-1.8h17.4a1.8 1.8 0 0 1 1.8 1.8v11.4a1.8 1.8 0 0 1-1.8 1.8H3.3a1.8 1.8 0 0 1-1.8-1.8zM9 18.3v1.8H4.5v2.4h15v-2.4h-4.505v-1.8z" />
      </g>
    </svg>
  )
);
IconDesktop24.displayName = 'IconDesktop24';
