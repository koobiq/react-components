import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconEnvelope24 = forwardRef(
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
        <path d="M0 4.8A1.8 1.8 0 0 1 1.8 3h20.4A1.8 1.8 0 0 1 24 4.8v.604l-11.843 7.261a.3.3 0 0 1-.314 0L0 5.405z" />
        <path d="M24 7.515V19.2a1.8 1.8 0 0 1-1.8 1.8H1.8A1.8 1.8 0 0 1 0 19.2V7.516l11.843 7.26a.3.3 0 0 0 .314 0z" />
      </g>
    </svg>
  )
);
IconEnvelope24.displayName = 'IconEnvelope24';
