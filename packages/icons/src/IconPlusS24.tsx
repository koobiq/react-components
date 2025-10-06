import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPlusS24 = forwardRef(
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
        d="M13.307 13.2H19.2a.3.3 0 0 0 .3-.3v-1.8a.3.3 0 0 0-.3-.3h-5.893v-6a.3.3 0 0 0-.3-.3h-1.8a.3.3 0 0 0-.3.3v6H4.8a.3.3 0 0 0-.3.3v1.8a.3.3 0 0 0 .3.3h6.107v6a.3.3 0 0 0 .3.3h1.8a.3.3 0 0 0 .3-.3z"
      />
    </svg>
  )
);
IconPlusS24.displayName = 'IconPlusS24';
