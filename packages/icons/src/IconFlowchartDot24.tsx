import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconFlowchartDot24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      fill="currentColor"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <circle cx={19.5} cy={4.5} r={3} fill="currentColor" />
      <path
        fill="currentColor"
        d="M14.851 5.7H12.9v12.6h3.6v-1.5a.3.3 0 0 1 .3-.3h5.4a.3.3 0 0 1 .3.3v5.4a.3.3 0 0 1-.3.3h-5.4a.3.3 0 0 1-.3-.3v-1.5h-5.7a.3.3 0 0 1-.3-.3v-7.2H7.25a3 3 0 1 1 0-2.4h3.25V3.6a.3.3 0 0 1 .3-.3h4.051a4.8 4.8 0 0 0 0 2.4"
      />
    </svg>
  )
);
IconFlowchartDot24.displayName = 'IconFlowchartDot24';
