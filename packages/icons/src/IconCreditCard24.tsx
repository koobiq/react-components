import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCreditCard24 = forwardRef(
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
        <path d="M1.8 3A1.8 1.8 0 0 0 0 4.8v3h24v-3A1.8 1.8 0 0 0 22.2 3zM0 10.8v8.4A1.8 1.8 0 0 0 1.8 21h20.4a1.8 1.8 0 0 0 1.8-1.8v-8.4zm2.55 6.6a.3.3 0 0 1-.3-.3v-1.2a.3.3 0 0 1 .3-.3h5.4a.3.3 0 0 1 .3.3v1.2a.3.3 0 0 1-.3.3z" />
      </g>
    </svg>
  )
);
IconCreditCard24.displayName = 'IconCreditCard24';
