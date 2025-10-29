import { forwardRef } from 'react';
import type { SVGProps, Ref } from 'react';

export const IconDrop16 = forwardRef(
  (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      ref={ref}
      {...props}
    >
      <path d="M8 15.5c2.9 0 5.25-2.383 5.25-5.324 0-1.448-.84-2.92-2.309-4.887L8.18 1.591a.223.223 0 0 0-.36 0L5.06 5.289C3.59 7.255 2.75 8.729 2.75 10.176 2.75 13.116 5.1 15.5 8 15.5" />
    </svg>
  )
);
IconDrop16.displayName = 'IconDrop16';
