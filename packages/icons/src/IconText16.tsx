import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconText16 = forwardRef(
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
        d="M9.17 14.3V3.258h4.13a.2.2 0 0 0 .2-.2V1.7a.2.2 0 0 0-.2-.2H2.7a.2.2 0 0 0-.2.2v1.358c0 .11.09.2.2.2h4.281V14.3c0 .11.09.2.2.2H8.97a.2.2 0 0 0 .2-.2"
      />
    </svg>
  )
);
IconText16.displayName = 'IconText16';
