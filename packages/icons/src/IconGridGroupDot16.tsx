import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconGridGroupDot16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      fill="currentColor"
      viewBox="0 0 16 16"
      ref={ref}
      {...props}
    >
      <path fill="currentColor" d="M16 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
      <path
        fill="currentColor"
        d="M10.96 1H2.2a.2.2 0 0 0-.2.2v13.6c0 .11.09.2.2.2h11.6a.2.2 0 0 0 .2-.2v-1.2a.2.2 0 0 0-.2-.2H3.6V2.6h7.256A3.2 3.2 0 0 1 10.96 1m.81 3.296-.066-.067A.2.2 0 0 0 11.6 4.2H5.4a.2.2 0 0 0-.2.2v1.2c0 .11.09.2.2.2h6.2a.2.2 0 0 0 .2-.2V4.4a.2.2 0 0 0-.03-.104M5.4 7.2a.2.2 0 0 0-.2.2v1.2c0 .11.09.2.2.2h6.2a.2.2 0 0 0 .2-.2V7.4a.2.2 0 0 0-.2-.2zm0 3a.2.2 0 0 0-.2.2v1.2c0 .11.09.2.2.2h6.2a.2.2 0 0 0 .2-.2v-1.2a.2.2 0 0 0-.2-.2z"
      />
    </svg>
  )
);
IconGridGroupDot16.displayName = 'IconGridGroupDot16';
