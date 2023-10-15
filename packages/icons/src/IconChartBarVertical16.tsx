import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChartBarVertical16 = forwardRef(
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
        <path d="M1 14.8c0 .11.09.2.2.2h1.4V1H1.2a.2.2 0 0 0-.2.2zM4 15h7.8a.2.2 0 0 0 .2-.2v-2.6a.2.2 0 0 0-.2-.2H4zM4 4h10.8a.2.2 0 0 0 .2-.2V1.2a.2.2 0 0 0-.2-.2H4zM8.8 9.5a.2.2 0 0 0 .2-.2V6.7a.2.2 0 0 0-.2-.2H4v3z" />
      </g>
    </svg>
  )
);
IconChartBarVertical16.displayName = 'IconChartBarVertical16';