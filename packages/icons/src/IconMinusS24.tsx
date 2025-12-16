import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconMinusS24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M19.5 12.9v-1.8a.3.3 0 0 0-.3-.3H4.8a.3.3 0 0 0-.3.3v1.8a.3.3 0 0 0 .3.3h14.4a.3.3 0 0 0 .3-.3" />
    </svg>
  )
);
IconMinusS24.displayName = 'IconMinusS24';
