import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronRight32 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={32}
      height={32}
      fill="currentColor"
      viewBox="0 0 32 32"
      ref={ref}
      {...props}
    >
      <path fill="currentColor" d="m10 8 2-2 10 10-10 10-2-2 8-8z" />
    </svg>
  )
);
IconChevronRight32.displayName = 'IconChevronRight32';
