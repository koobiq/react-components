import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconSplitScreenBottom16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <path
        fill="currentColor"
        d="M1 3.2A1.2 1.2 0 0 1 2.2 2h11.6A1.2 1.2 0 0 1 15 3.2v9.6a1.2 1.2 0 0 1-1.2 1.2H2.2A1.2 1.2 0 0 1 1 12.8zM2.8 9h10.4a.2.2 0 0 0 .2-.2v-5a.2.2 0 0 0-.2-.2H2.8a.2.2 0 0 0-.2.2v5c0 .11.09.2.2.2"
      />
    </svg>
  )
);
IconSplitScreenBottom16.displayName = 'IconSplitScreenBottom16';
