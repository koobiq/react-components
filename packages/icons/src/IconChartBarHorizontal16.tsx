import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChartBarHorizontal16 = forwardRef(
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
        <path d="M1.2 15a.2.2 0 0 1-.2-.2v-1.4h14v1.4a.2.2 0 0 1-.2.2zM1 12V4.2c0-.11.09-.2.2-.2h2.6c.11 0 .2.09.2.2V12zM12 12V1.2c0-.11.09-.2.2-.2h2.6c.11 0 .2.09.2.2V12zM6.5 7.2c0-.11.09-.2.2-.2h2.6c.11 0 .2.09.2.2V12h-3z" />
      </g>
    </svg>
  )
);
IconChartBarHorizontal16.displayName = 'IconChartBarHorizontal16';
