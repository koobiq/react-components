import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowUpArrowDownDot16 = forwardRef(
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
        <path d="M10.662 5.185v6.8l-2.52-2.523a.2.2 0 0 0-.285 0L7 10.32a.203.203 0 0 0 0 .287l4.327 4.334c.08.079.207.079.286 0l4.328-4.334a.203.203 0 0 0 0-.287l-.858-.858a.2.2 0 0 0-.285 0l-2.52 2.522V6.118a3.2 3.2 0 0 1-1.616-.933" />
        <path d="M9 5.393a.203.203 0 0 1 0 .287l-.857.858a.2.2 0 0 1-.286 0L5.338 4.016v10.36c0 .111-.09.202-.202.202H3.923a.2.2 0 0 1-.202-.202V4.016L1.202 6.538a.2.2 0 0 1-.285 0L.059 5.68a.203.203 0 0 1 0-.287L4.387 1.06a.2.2 0 0 1 .286 0z" />
      </g>
      <path fill="currentColor" d="M15 3a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
    </svg>
  )
);
IconArrowUpArrowDownDot16.displayName = 'IconArrowUpArrowDownDot16';
