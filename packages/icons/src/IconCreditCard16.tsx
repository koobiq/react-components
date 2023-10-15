import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCreditCard16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M1.2 2A1.2 1.2 0 0 0 0 3.2v2h16v-2A1.2 1.2 0 0 0 14.8 2zM0 7.2v5.6A1.2 1.2 0 0 0 1.2 14h13.6a1.2 1.2 0 0 0 1.2-1.2V7.2zm1.7 4.4a.2.2 0 0 1-.2-.2v-.8c0-.11.09-.2.2-.2h3.6c.11 0 .2.09.2.2v.8a.2.2 0 0 1-.2.2z" />
      </g>
    </svg>
  )
);
IconCreditCard16.displayName = 'IconCreditCard16';
