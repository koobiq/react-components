import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconEnvelopeDot24 = forwardRef(
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
        <path d="M21.09 9.3c1.1-.021 2.11-.412 2.91-1.053V19.2a1.8 1.8 0 0 1-1.8 1.8H1.8A1.8 1.8 0 0 1 0 19.2V7.516l11.843 7.26a.3.3 0 0 0 .314 0z" />
        <path d="M16.44 3H1.8A1.8 1.8 0 0 0 0 4.8v.604l11.843 7.261a.3.3 0 0 0 .314 0l6.491-3.98A4.8 4.8 0 0 1 16.44 3" />
      </g>
      <g fill="currentColor">
        <path d="M21 7.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
        <path d="M21 7.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
      </g>
    </svg>
  )
);
IconEnvelopeDot24.displayName = 'IconEnvelopeDot24';
