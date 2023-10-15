import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconRobot16 = forwardRef(
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
        <path d="M4.9 7.5a.2.2 0 0 0-.2.2v2.1a.2.2 0 0 0 .2.2H7a.2.2 0 0 0 .2-.2V7.7a.2.2 0 0 0-.2-.2zM8.8 7.7a.2.2 0 0 1 .2-.2h2.1c.11 0 .2.09.2.2v2.1a.2.2 0 0 1-.2.2H9a.2.2 0 0 1-.2-.2z" />
        <path d="M5.2 1a.2.2 0 0 0-.2.2v1.2c0 .11.09.2.2.2h2V4h-4A1.2 1.2 0 0 0 2 5.2v2.2H.7a.2.2 0 0 0-.2.2v3.2c0 .11.09.2.2.2H2v2.8A1.2 1.2 0 0 0 3.2 15h9.602a1.2 1.2 0 0 0 1.2-1.2V11h1.3a.2.2 0 0 0 .2-.2V7.6a.2.2 0 0 0-.2-.2h-1.3V5.2a1.2 1.2 0 0 0-1.2-1.2H8.8V1.2a.2.2 0 0 0-.2-.2zM3.6 5.8c0-.11.09-.2.2-.2h8.402c.11 0 .2.09.2.2v7.4a.2.2 0 0 1-.2.2H10v-1.2a.2.2 0 0 0-.2-.2H6.2a.2.2 0 0 0-.2.2v1.2H3.8a.2.2 0 0 1-.2-.2z" />
      </g>
    </svg>
  )
);
IconRobot16.displayName = 'IconRobot16';
