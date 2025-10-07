import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconAlignCenter24 = forwardRef(
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
        <path d="M4.5 20.7a.3.3 0 0 0 .3.3h14.4a.3.3 0 0 0 .3-.3V18.9a.3.3 0 0 0-.3-.3H4.8a.3.3 0 0 0-.3.3zM4.2 10.3a.3.3 0 0 0 .3.3h15a.3.3 0 0 0 .3-.3V8.5a.3.3 0 0 0-.3-.3h-15a.3.3 0 0 0-.3.3zM0 15.5a.3.3 0 0 0 .3.3h23.4a.3.3 0 0 0 .3-.3v-1.8a.3.3 0 0 0-.3-.3H.3a.3.3 0 0 0-.3.3zM0 5.099V3.3A.3.3 0 0 1 .3 3h23.4a.3.3 0 0 1 .3.3v1.799a.3.3 0 0 1-.3.3H.3a.3.3 0 0 1-.3-.3" />
      </g>
    </svg>
  )
);
IconAlignCenter24.displayName = 'IconAlignCenter24';
