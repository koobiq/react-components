import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPlusCircle24 = forwardRef(
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
        d="M12 22.5c5.799 0 10.5-4.701 10.5-10.5S17.799 1.5 12 1.5 1.5 6.201 1.5 12 6.201 22.5 12 22.5m1.205-9.3v4.5a.3.3 0 0 1-.3.3h-1.8a.3.3 0 0 1-.3-.3v-4.5H6.2a.3.3 0 0 1-.3-.3v-1.8a.3.3 0 0 1 .3-.3h4.606V6.3a.3.3 0 0 1 .3-.3h1.8a.3.3 0 0 1 .3.3v4.5H17.6a.3.3 0 0 1 .3.3v1.8a.3.3 0 0 1-.3.3z"
      />
    </svg>
  )
);
IconPlusCircle24.displayName = 'IconPlusCircle24';
