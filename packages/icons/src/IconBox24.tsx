import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBox24 = forwardRef(
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
        <path d="M0 4.8A1.8 1.8 0 0 1 1.8 3h5.4a.3.3 0 0 1 .3.3v8.4a.3.3 0 0 0 .3.3h2.4a.3.3 0 0 0 .3-.3V3.3a.3.3 0 0 1 .3-.3h5.4A1.8 1.8 0 0 1 18 4.8v14.4a1.8 1.8 0 0 1-1.8 1.8H1.8A1.8 1.8 0 0 1 0 19.2zM24 19.2V4.8A1.8 1.8 0 0 0 22.2 3h-.6a1.8 1.8 0 0 0-1.8 1.8v14.4a1.8 1.8 0 0 0 1.8 1.8h.6a1.8 1.8 0 0 0 1.8-1.8" />
      </g>
    </svg>
  )
);
IconBox24.displayName = 'IconBox24';
