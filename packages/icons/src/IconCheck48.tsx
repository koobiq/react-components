import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCheck48 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={48}
      height={48}
      fill="currentColor"
      viewBox="0 0 48 48"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M44.621 13.622 20.5 37.742 5.379 22.623l4.242-4.243L20.5 29.258l19.879-19.88z"
      />
    </svg>
  )
);
IconCheck48.displayName = 'IconCheck48';
