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
      <path
        fill="currentColor"
        d="M3.3 1.5a1.8 1.8 0 0 0-1.8 1.8v11.4a1.8 1.8 0 0 0 1.8 1.8H9v3.6H4.5v2.4h15v-2.4h-4.505v-3.6H20.7a1.8 1.8 0 0 0 1.8-1.8V3.3a1.8 1.8 0 0 0-1.8-1.8zm.6 2.7a.3.3 0 0 1 .3-.3h15.6a.3.3 0 0 1 .3.3v9.6a.3.3 0 0 1-.3.3H4.2a.3.3 0 0 1-.3-.3z"
      />
    </svg>
  )
);
IconDesktop24.displayName = 'IconDesktop24';
