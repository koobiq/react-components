import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChartBarHorizontal24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="M1.8 22.5a.3.3 0 0 1-.3-.3v-2.1h21v2.1a.3.3 0 0 1-.3.3zM1.5 18V6.3a.3.3 0 0 1 .3-.3h3.9a.3.3 0 0 1 .3.3V18zM18 18V1.8a.3.3 0 0 1 .3-.3h3.9a.3.3 0 0 1 .3.3V18zM9.75 10.8a.3.3 0 0 1 .3-.3h3.9a.3.3 0 0 1 .3.3V18h-4.5z" />
      </g>
    </svg>
  )
);
IconChartBarHorizontal24.displayName = 'IconChartBarHorizontal24';
