import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconSplitScreenLeft24 = forwardRef(
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
        d="M1.5 19.2A1.8 1.8 0 0 0 3.3 21h17.4a1.8 1.8 0 0 0 1.8-1.8V4.8A1.8 1.8 0 0 0 20.7 3H3.3a1.8 1.8 0 0 0-1.8 1.8zm7.8-.6a.3.3 0 0 1-.3-.3V5.7a.3.3 0 0 1 .3-.3h10.5a.3.3 0 0 1 .3.3v12.6a.3.3 0 0 1-.3.3z"
      />
    </svg>
  )
);
IconSplitScreenLeft24.displayName = 'IconSplitScreenLeft24';
