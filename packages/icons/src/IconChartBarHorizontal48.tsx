import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChartBarHorizontal48 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M32 8v27h-3V8zm-14 6v21h-3V14zm-7 21v-9H8v9zm28 0v-6h-3v6zm-14 0V20h-3v15zm19 7v-3H4v3z" />
    </svg>
  )
);
IconChartBarHorizontal48.displayName = 'IconChartBarHorizontal48';
