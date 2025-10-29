import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronLeft32 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="m22 8-8 8 8 8-2 2-10-10L20 6z" />
    </svg>
  )
);
IconChevronLeft32.displayName = 'IconChevronLeft32';
