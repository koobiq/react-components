import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconSplitScreenTop16 = forwardRef(
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
        d="M15 12.8V3.2A1.2 1.2 0 0 0 13.8 2H2.2A1.2 1.2 0 0 0 1 3.2v9.6A1.2 1.2 0 0 0 2.2 14h11.6a1.2 1.2 0 0 0 1.2-1.2M13.2 7c.11 0 .2.09.2.2v5a.2.2 0 0 1-.2.2H2.8a.2.2 0 0 1-.2-.2v-5c0-.11.09-.2.2-.2z"
      />
    </svg>
  )
);
IconSplitScreenTop16.displayName = 'IconSplitScreenTop16';
