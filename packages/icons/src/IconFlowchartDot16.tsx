import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconFlowchartDot16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <circle cx={13} cy={3} r={2} fill="currentColor" />
      <path
        fill="currentColor"
        d="M9.9 3.8H8.6v8.4H11v-1c0-.11.09-.2.2-.2h3.6c.11 0 .2.09.2.2v3.6a.2.2 0 0 1-.2.2h-3.6a.2.2 0 0 1-.2-.2v-1H7.2a.2.2 0 0 1-.2-.2V8.8H4.834a2 2 0 1 1 0-1.6H7V2.4c0-.11.09-.2.2-.2h2.7a3.2 3.2 0 0 0 0 1.6"
      />
    </svg>
  )
);
IconFlowchartDot16.displayName = 'IconFlowchartDot16';
