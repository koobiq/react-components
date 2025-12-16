import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChartArea24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="m6 18 6.073-6.08a.25.25 0 0 1 .354 0l1.698 1.7 6.448-6.455a.25.25 0 0 1 .427.177V18z" />
        <path d="M1.5 1.8a.3.3 0 0 1 .3-.3h1.8a.3.3 0 0 1 .3.3v18.3h18.306a.3.3 0 0 1 .3.3v1.8a.3.3 0 0 1-.3.3H1.5z" />
      </g>
    </svg>
  )
);
IconChartArea24.displayName = 'IconChartArea24';
