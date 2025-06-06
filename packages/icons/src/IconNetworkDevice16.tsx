import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconNetworkDevice16 = forwardRef(
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
        <path d="M1 2.2A1.2 1.2 0 0 1 2.2 1h11.6A1.2 1.2 0 0 1 15 2.2v6.4a1.2 1.2 0 0 1-1.2 1.2h-5v1.366a2 2 0 1 1-1.6 0V9.8h-5A1.2 1.2 0 0 1 1 8.6zm1.6.6V8c0 .11.09.2.2.2h10.4a.2.2 0 0 0 .2-.2V2.8a.2.2 0 0 0-.2-.2H2.8a.2.2 0 0 0-.2.2" />
        <path d="M11.1 13.8a3.2 3.2 0 0 0 0-1.6h3.7c.11 0 .2.09.2.2v1.2a.2.2 0 0 1-.2.2zM4.9 13.8H1.2a.2.2 0 0 1-.2-.2v-1.2c0-.11.09-.2.2-.2h3.7a3.2 3.2 0 0 0 0 1.6" />
      </g>
    </svg>
  )
);
IconNetworkDevice16.displayName = 'IconNetworkDevice16';
