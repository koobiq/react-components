import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconMinusS24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      fill="currentColor"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M19.5 12.9v-1.8a.3.3 0 0 0-.3-.3H4.8a.3.3 0 0 0-.3.3v1.8a.3.3 0 0 0 .3.3h14.4a.3.3 0 0 0 .3-.3"
      />
    </svg>
  )
);
IconMinusS24.displayName = 'IconMinusS24';
