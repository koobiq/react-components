import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const Icon3Columns32 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={32}
      height={32}
      fill="currentColor"
      viewBox="0 0 32 32"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M25 27a2 2 0 0 0 2-2V7.002a2 2 0 0 0-2.002-2L6 5.018a2 2 0 0 0-1.999 2V25a2 2 0 0 0 2 2zM6 25V7.017L11 7v18zm12 0h-5V7.017L18 7zm2 0V7.017L25 7v18z"
      />
    </svg>
  )
);
Icon3Columns32.displayName = 'Icon3Columns32';
