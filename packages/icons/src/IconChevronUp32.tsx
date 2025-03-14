import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconChevronUp32 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={32}
      height={32}
      fill="currentColor"
      viewBox="0 0 32 32"
      ref={ref}
      {...props}
    >
      <path fill="currentColor" d="m24 22-8-8-8 8-2-2 10-10 10 10z" />
    </svg>
  )
);
IconChevronUp32.displayName = 'IconChevronUp32';
