import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconSplitScreenRight24 = forwardRef(
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
        d="M22.5 19.2a1.8 1.8 0 0 1-1.8 1.8H3.3a1.8 1.8 0 0 1-1.8-1.8V4.8A1.8 1.8 0 0 1 3.3 3h17.4a1.8 1.8 0 0 1 1.8 1.8zm-7.8-.6a.3.3 0 0 0 .3-.3V5.7a.3.3 0 0 0-.3-.3H4.2a.3.3 0 0 0-.3.3v12.6a.3.3 0 0 0 .3.3z"
      />
    </svg>
  )
);
IconSplitScreenRight24.displayName = 'IconSplitScreenRight24';
