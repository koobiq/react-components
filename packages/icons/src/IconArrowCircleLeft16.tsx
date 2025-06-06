import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconArrowCircleLeft16 = forwardRef(
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
        d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m3.13.428-.029-.03-.258-.258a.2.2 0 0 1 0-.283l.566-.566.015-.013 3.06-3.06a.2.2 0 0 1 .283 0l.566.565a.2.2 0 0 1 0 .283L5.999 7.4H11.8c.11 0 .2.09.2.2v.8a.2.2 0 0 1-.2.2H5.999l2.334 2.334a.2.2 0 0 1 0 .283l-.566.566a.2.2 0 0 1-.283 0z"
      />
    </svg>
  )
);
IconArrowCircleLeft16.displayName = 'IconArrowCircleLeft16';
