import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconHouseO16 = forwardRef(
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
        d="M11.6 9.4H4.4v4H2.6V7.736L8 3.107l5.4 4.629V13.4h-1.8zM1.42 6.64a1.2 1.2 0 0 0-.42.912V14.8c0 .11.09.2.2.2h4.6a.2.2 0 0 0 .2-.2V11h4v3.8c0 .11.09.2.2.2h4.6a.2.2 0 0 0 .2-.2V7.552a1.2 1.2 0 0 0-.42-.911L8.13 1.11a.2.2 0 0 0-.26 0z"
      />
    </svg>
  )
);
IconHouseO16.displayName = 'IconHouseO16';
