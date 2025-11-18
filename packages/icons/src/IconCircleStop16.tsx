import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconCircleStop16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14M5.5 5a.5.5 0 0 0-.5.5v5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5v-5a.5.5 0 0 0-.5-.5z" />
    </svg>
  )
);
IconCircleStop16.displayName = 'IconCircleStop16';
