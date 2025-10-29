import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconPlusS16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M8.871 8.8H12.8a.2.2 0 0 0 .2-.2V7.4a.2.2 0 0 0-.2-.2H8.871v-4a.2.2 0 0 0-.2-.2h-1.2a.2.2 0 0 0-.2.2v4H3.2a.2.2 0 0 0-.2.2v1.2c0 .11.09.2.2.2h4.071v4c0 .11.09.2.2.2h1.2a.2.2 0 0 0 .2-.2z" />
    </svg>
  )
);
IconPlusS16.displayName = 'IconPlusS16';
