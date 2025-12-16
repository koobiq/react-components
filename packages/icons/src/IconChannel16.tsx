import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChannel16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M11 1.2c0-.11.09-.2.2-.2h3.6c.11 0 .2.09.2.2v5.6a.2.2 0 0 1-.2.2h-3.6a.2.2 0 0 1-.2-.2v-2H8.8v7.8a.2.2 0 0 1-.2.2H5v2a.2.2 0 0 1-.2.2H1.2a.2.2 0 0 1-.2-.2V9.2c0-.11.09-.2.2-.2h3.6c.11 0 .2.09.2.2v2h2.2V3.4c0-.11.09-.2.2-.2H11z" />
    </svg>
  )
);
IconChannel16.displayName = 'IconChannel16';
