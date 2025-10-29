import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPause16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="M9 3.2c0-.11.09-.2.2-.2h2.6c.111 0 .2.09.2.2v9.6a.2.2 0 0 1-.2.2H9.2a.2.2 0 0 1-.2-.2zM4 3.2c0-.11.09-.2.2-.2h2.6c.11 0 .2.09.2.2v9.6a.2.2 0 0 1-.2.2H4.2a.2.2 0 0 1-.2-.2z" />
      </g>
    </svg>
  )
);
IconPause16.displayName = 'IconPause16';
