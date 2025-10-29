import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconHouse16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M1.419 6.64A1.2 1.2 0 0 0 1 7.553V14.8c0 .11.09.2.2.2h4.1a.2.2 0 0 0 .2-.2v-4.1c0-.11.09-.2.2-.2h4.6c.11 0 .2.09.2.2v4.1c0 .11.09.2.2.2h4.1a.2.2 0 0 0 .2-.2V7.552a1.2 1.2 0 0 0-.42-.911L8.13 1.11a.2.2 0 0 0-.26 0z" />
    </svg>
  )
);
IconHouse16.displayName = 'IconHouse16';
