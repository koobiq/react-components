import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChartBarHorizontal32 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="M22 5v18h-2V5zM12 9v14h-2V9zM7 23v-6H5v6zM27 23v-4h-2v4zM17 23V13h-2v10zM29 28v-2H3v2z" />
      </g>
    </svg>
  )
);
IconChartBarHorizontal32.displayName = 'IconChartBarHorizontal32';
