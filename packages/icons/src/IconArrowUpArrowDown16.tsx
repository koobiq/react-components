import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowUpArrowDown16 = forwardRef(
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
        <path d="M9 5.68a.203.203 0 0 0 0-.287L4.673 1.06a.2.2 0 0 0-.286 0L.059 5.393a.203.203 0 0 0 0 .287l.858.858a.2.2 0 0 0 .285 0l2.52-2.522v10.36c0 .111.09.202.201.202h1.213c.112 0 .202-.09.202-.202V4.016l2.52 2.522a.2.2 0 0 0 .285 0z" />
        <path d="M7 10.32a.203.203 0 0 0 0 .287l4.327 4.334c.08.079.207.079.286 0l4.328-4.334a.203.203 0 0 0 0-.287l-.858-.858a.2.2 0 0 0-.285 0l-2.52 2.522V1.624a.2.2 0 0 0-.202-.202h-1.212a.2.2 0 0 0-.202.203v10.36l-2.52-2.523a.2.2 0 0 0-.285 0z" />
      </g>
    </svg>
  )
);
IconArrowUpArrowDown16.displayName = 'IconArrowUpArrowDown16';
