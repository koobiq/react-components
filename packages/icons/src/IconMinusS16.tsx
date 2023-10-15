import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconMinusS16 = forwardRef(
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
        d="M13 8.6V7.4a.2.2 0 0 0-.2-.2H3.2a.2.2 0 0 0-.2.2v1.2c0 .11.09.2.2.2h9.6a.2.2 0 0 0 .2-.2"
      />
    </svg>
  )
);
IconMinusS16.displayName = 'IconMinusS16';
