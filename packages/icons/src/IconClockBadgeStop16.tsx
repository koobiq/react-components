import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconClockBadgeStop16 = forwardRef(
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
        <path d="M8 13.4q.305 0 .6-.033v1.608A7 7 0 1 1 14.975 8.6h-1.608q.033-.295.033-.6A5.4 5.4 0 1 0 8 13.4" />
        <path d="M8.8 8.6a.2.2 0 0 1-.2.2H4.7a.2.2 0 0 1-.2-.2V7.4c0-.11.09-.2.2-.2h2.5v-3c0-.11.09-.2.2-.2h1.2c.11 0 .2.09.2.2zM10 10.2c0-.11.09-.2.2-.2h5.6c.11 0 .2.09.2.2v5.6a.2.2 0 0 1-.2.2h-5.6a.2.2 0 0 1-.2-.2z" />
      </g>
    </svg>
  )
);
IconClockBadgeStop16.displayName = 'IconClockBadgeStop16';