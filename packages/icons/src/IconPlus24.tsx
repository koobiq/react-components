import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPlus24 = forwardRef(
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
        d="M13.307 13.2H20.7a.3.3 0 0 0 .3-.3v-1.8a.3.3 0 0 0-.3-.3h-7.393V3.3a.3.3 0 0 0-.3-.3h-1.8a.3.3 0 0 0-.3.3v7.5H3.3a.3.3 0 0 0-.3.3v1.8a.3.3 0 0 0 .3.3h7.607v7.5a.3.3 0 0 0 .3.3h1.8a.3.3 0 0 0 .3-.3z"
      />
    </svg>
  )
);
IconPlus24.displayName = 'IconPlus24';
