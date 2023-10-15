import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconInbox16 = forwardRef(
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
        d="M2.2 2A1.2 1.2 0 0 0 1 3.2v9.6A1.2 1.2 0 0 0 2.2 14h11.6a1.2 1.2 0 0 0 1.2-1.2V3.2A1.2 1.2 0 0 0 13.8 2zm.4 7.003V3.8c0-.11.09-.2.2-.2h10.4c.11 0 .2.09.2.2v5.203h-3.2c-.11 0-.2.09-.21.2a2 2 0 0 1-3.98 0 .216.216 0 0 0-.21-.2z"
      />
    </svg>
  )
);
IconInbox16.displayName = 'IconInbox16';
