import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconLockOpen16 = forwardRef(
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
        d="M8 1a4 4 0 0 0-3.995 3.8c-.006.11.085.2.195.2h1.2c.11 0 .2-.09.208-.2A2.4 2.4 0 0 1 10.4 5v2H3.2A1.2 1.2 0 0 0 2 8.2v5.6A1.2 1.2 0 0 0 3.2 15h9.6a1.2 1.2 0 0 0 1.2-1.2V8.2A1.2 1.2 0 0 0 12.8 7H12V5a4 4 0 0 0-4-4m1 9a1 1 0 0 1-.684.949l.64 1.92a.1.1 0 0 1-.095.131H7.14a.1.1 0 0 1-.095-.132l.64-1.92A1 1 0 1 1 9 10"
      />
    </svg>
  )
);
IconLockOpen16.displayName = 'IconLockOpen16';
