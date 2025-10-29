import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronDown32 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="m24 10 2 2-10 10L6 12l2-2 8 8z" />
    </svg>
  )
);
IconChevronDown32.displayName = 'IconChevronDown32';
