import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPlus32 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={32}
      height={32}
      fill="currentColor"
      viewBox="0 0 32 32"
      ref={ref}
      {...props}
    >
      <path fill="currentColor" d="M14 4h4v10h10v4H18v10h-4V18H4v-4h10z" />
    </svg>
  )
);
IconPlus32.displayName = 'IconPlus32';
