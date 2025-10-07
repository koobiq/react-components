import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconMinus24 = forwardRef(
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
        d="M21 12.9v-1.8a.3.3 0 0 0-.3-.3H3.3a.3.3 0 0 0-.3.3v1.8a.3.3 0 0 0 .3.3h17.4a.3.3 0 0 0 .3-.3"
      />
    </svg>
  )
);
IconMinus24.displayName = 'IconMinus24';
