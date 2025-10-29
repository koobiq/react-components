import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPause24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="M13.501 4.8a.3.3 0 0 1 .3-.3h3.9a.3.3 0 0 1 .3.3v14.4a.3.3 0 0 1-.3.3h-3.9a.3.3 0 0 1-.3-.3zM6 4.8a.3.3 0 0 1 .3-.3h3.9a.3.3 0 0 1 .3.3v14.4a.3.3 0 0 1-.3.3H6.3a.3.3 0 0 1-.3-.3z" />
      </g>
    </svg>
  )
);
IconPause24.displayName = 'IconPause24';
