import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBarsSortTop16 = forwardRef(
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
      <g>
        <path d="M1.2 8.8a.2.2 0 0 1-.2-.2V7.4c0-.11.09-.2.2-.2h9.6c.11 0 .2.09.2.2v1.2a.2.2 0 0 1-.2.2zM1.2 13a.2.2 0 0 1-.2-.2v-1.2c0-.11.09-.2.2-.2h4.6c.11 0 .2.09.2.2v1.2a.2.2 0 0 1-.2.2zM1.2 4.6a.2.2 0 0 1-.2-.2V3.2c0-.11.09-.2.2-.2h13.6c.11 0 .2.09.2.2v1.2a.2.2 0 0 1-.2.2z" />
      </g>
    </svg>
  )
);
IconBarsSortTop16.displayName = 'IconBarsSortTop16';
