import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconSplitScreenLeft16 = forwardRef(
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
        d="M1 12.8A1.2 1.2 0 0 0 2.2 14h11.6a1.2 1.2 0 0 0 1.2-1.2V3.2A1.2 1.2 0 0 0 13.8 2H2.2A1.2 1.2 0 0 0 1 3.2zm5.2-.4a.2.2 0 0 1-.2-.2V3.8c0-.11.09-.2.2-.2h7c.11 0 .2.09.2.2v8.4a.2.2 0 0 1-.2.2z"
      />
    </svg>
  )
);
IconSplitScreenLeft16.displayName = 'IconSplitScreenLeft16';
