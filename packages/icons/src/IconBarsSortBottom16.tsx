import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconBarsSortBottom16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M1.2 7.2a.2.2 0 0 0-.2.2v1.2c0 .11.09.2.2.2h9.6a.2.2 0 0 0 .2-.2V7.4a.2.2 0 0 0-.2-.2zM1.2 3a.2.2 0 0 0-.2.2v1.2c0 .11.09.2.2.2h4.6a.2.2 0 0 0 .2-.2V3.2a.2.2 0 0 0-.2-.2zM1.2 11.4a.2.2 0 0 0-.2.2v1.2c0 .11.09.2.2.2h13.6a.2.2 0 0 0 .2-.2v-1.2a.2.2 0 0 0-.2-.2z" />
      </g>
    </svg>
  )
);
IconBarsSortBottom16.displayName = 'IconBarsSortBottom16';
