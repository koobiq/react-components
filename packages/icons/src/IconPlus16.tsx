import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPlus16 = forwardRef(
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
        d="M8.871 8.8H13.8a.2.2 0 0 0 .2-.2V7.4a.2.2 0 0 0-.2-.2H8.871v-5a.2.2 0 0 0-.2-.2h-1.2a.2.2 0 0 0-.2.2v5H2.2a.2.2 0 0 0-.2.2v1.2c0 .11.09.2.2.2h5.071v5c0 .11.09.2.2.2h1.2a.2.2 0 0 0 .2-.2z"
      />
    </svg>
  )
);
IconPlus16.displayName = 'IconPlus16';
