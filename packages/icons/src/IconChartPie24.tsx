import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChartPie24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      fill="currentColor"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M19.96 18.842a10.48 10.48 0 0 0 2.54-6.857c0-2.62-.957-5.015-2.54-6.856l-6.847 6.856zM18.847 4.014a10.45 10.45 0 0 0-6.06-2.514v8.582z" />
        <path d="M11.213 1.5C5.78 1.903 1.5 6.444 1.5 11.985 1.5 17.793 6.201 22.5 12 22.5a10.45 10.45 0 0 0 6.847-2.543l-7.634-7.646z" />
      </g>
    </svg>
  )
);
IconChartPie24.displayName = 'IconChartPie24';
