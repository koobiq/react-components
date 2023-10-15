import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconMobile16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M3 14.8a1.2 1.2 0 0 0 1 1.183V16h8v-.017a1.2 1.2 0 0 0 1-1.183V1.2a1.2 1.2 0 0 0-1-1.183V0H4v.017q-.106.017-.206.053A1.2 1.2 0 0 0 3 1.2zM4.8 3h6.4a.2.2 0 0 1 .2.2v9.6a.2.2 0 0 1-.2.2H4.8a.2.2 0 0 1-.2-.2V3.2c0-.11.09-.2.2-.2"
      />
    </svg>
  )
);
IconMobile16.displayName = 'IconMobile16';
