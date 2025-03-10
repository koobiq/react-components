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
        d="M12.35 1A3.65 3.65 0 0 0 8.7 4.65V7H2.2A1.2 1.2 0 0 0 1 8.2v5.6A1.2 1.2 0 0 0 2.2 15h9.6a1.2 1.2 0 0 0 1.2-1.2V8.2A1.2 1.2 0 0 0 11.8 7h-1.5V4.65a2.05 2.05 0 1 1 4.1 0V6.8c0 .11.09.2.2.2h1.2a.2.2 0 0 0 .2-.2V4.65A3.65 3.65 0 0 0 12.35 1"
      />
    </svg>
  )
);
IconLockOpen16.displayName = 'IconLockOpen16';
