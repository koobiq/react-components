import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconGripVerticalS24 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={24}
      height={24}
      fill="currentColor"
      viewBox="0 0 24 24"
      ref={ref}
      {...props}
    >
      <g fill="currentColor">
        <path d="M7.5 4.5v3h3v-3zM7.5 10.5v3h3v-3zM7.5 16.5v3h3v-3zM13.5 16.5v3h3v-3zM13.5 13.5v-3h3v3zM13.5 7.5v-3h3v3z" />
      </g>
    </svg>
  )
);
IconGripVerticalS24.displayName = 'IconGripVerticalS24';
