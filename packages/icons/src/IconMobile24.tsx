import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconMobile24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      fill="currentColor"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M4.5 22.2A1.8 1.8 0 0 0 6 23.975V24h12v-.025a1.8 1.8 0 0 0 1.5-1.775V1.8A1.8 1.8 0 0 0 18 .025V0H6v.025q-.16.027-.309.08A1.8 1.8 0 0 0 4.5 1.8zM7.2 4.5h9.6a.3.3 0 0 1 .3.3v14.4a.3.3 0 0 1-.3.3H7.2a.3.3 0 0 1-.3-.3V4.8a.3.3 0 0 1 .3-.3"
      />
    </svg>
  )
);
IconMobile24.displayName = 'IconMobile24';
