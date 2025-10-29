import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconMessage16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M1 4.4A2.4 2.4 0 0 1 3.4 2h9.2A2.4 2.4 0 0 1 15 4.4v6.2a2.4 2.4 0 0 1-2.4 2.4H7.75l-3.425 2.74A.2.2 0 0 1 4 15.584V13h-.6A2.4 2.4 0 0 1 1 10.6zm8 3.1a1 1 0 1 0-2 0 1 1 0 0 0 2 0m2 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2m-5-1a1 1 0 1 0-2 0 1 1 0 0 0 2 0" />
    </svg>
  )
);
IconMessage16.displayName = 'IconMessage16';
