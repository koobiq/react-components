import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconGripVerticalS16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <g>
        <path d="M5 3v2h2V3zM5 7v2h2V7zM5 11v2h2v-2zM9 11v2h2v-2zM9 9V7h2v2zM9 5V3h2v2z" />
      </g>
    </svg>
  )
);
IconGripVerticalS16.displayName = 'IconGripVerticalS16';
