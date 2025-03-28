import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowCircleUp16 = forwardRef(
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
        d="M8 1a7 7 0 1 1 0 14A7 7 0 0 1 8 1m-.428 3.13L4.217 7.484a.2.2 0 0 0 0 .283l.566.566a.2.2 0 0 0 .283 0L7.4 5.999V11.8c0 .11.09.2.2.2h.8a.2.2 0 0 0 .2-.2V5.999l2.334 2.334a.2.2 0 0 0 .283 0l.566-.566a.2.2 0 0 0 0-.283l-3.06-3.06-.014-.015-.566-.566a.2.2 0 0 0-.283 0l-.258.258z"
      />
    </svg>
  )
);
IconArrowCircleUp16.displayName = 'IconArrowCircleUp16';
